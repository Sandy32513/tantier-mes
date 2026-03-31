function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

function normalizeBoolean(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'y'].includes(text) ? 1 : 0;
}

function fieldLabel(field) {
  return field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function deriveDisplayState(row, lifecycleField) {
  const lifecycleValue = String(row?.[lifecycleField] ?? 'Draft');
  if (lifecycleValue === 'Released' && Number(row?.is_default || 0) === 1) {
    return 'Active';
  }
  return lifecycleValue;
}

function formatRow(row, lifecycleField) {
  if (!row) return null;
  return {
    ...row,
    revision_name: `Revision ${Number(row.revision_number || 0)}`,
    is_default: Number(row.is_default || 0),
    display_state: deriveDisplayState(row, lifecycleField)
  };
}

function createProductConfigModel(config) {
  const {
    table,
    entityName,
    keyField,
    lifecycleField,
    requiredFields,
    editableFields,
    optionalFields = [],
    fieldTypes = {}
  } = config;

  const allManagedFields = [...new Set([keyField, ...requiredFields, ...editableFields, ...optionalFields])];
  const dataFields = [...new Set([keyField, ...requiredFields.filter((field) => field !== keyField), ...editableFields.filter((field) => field !== keyField), ...optionalFields])];

  function normalizeFieldValue(field, value) {
    switch (fieldTypes[field]) {
      case 'boolean':
        return normalizeBoolean(value);
      case 'number': {
        if (isBlank(value)) return null;
        const numberValue = Number(value);
        if (Number.isNaN(numberValue)) {
          throw createHttpError(`${fieldLabel(field)} must be a valid number.`);
        }
        return numberValue;
      }
      case 'date': {
        const text = normalizeText(value);
        return text || null;
      }
      default:
        return normalizeText(value);
    }
  }

  function mapPayload(payload = {}) {
    return allManagedFields.reduce((acc, field) => {
      acc[field] = normalizeFieldValue(field, payload[field]);
      return acc;
    }, {});
  }

  async function fetchById(executor, id) {
    const [rows] = await executor.query(`SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`, [Number(id)]);
    if (!rows.length) {
      throw createHttpError(`${entityName} not found.`, 404);
    }
    return rows[0];
  }

  async function list(db) {
    const [rows] = await db.query(
      `SELECT * FROM \`${table}\` ORDER BY \`${keyField}\` ASC, revision_number DESC, created_date DESC, id DESC`
    );
    return rows.map((row) => formatRow(row, lifecycleField));
  }

  async function getById(db, id) {
    const row = await fetchById(db, id);
    return formatRow(row, lifecycleField);
  }

  async function create(db, payload) {
    const values = mapPayload(payload);

    requiredFields.forEach((field) => {
      if (isBlank(values[field])) {
        throw createHttpError(`${fieldLabel(field)} is required.`);
      }
    });

    const [duplicates] = await db.query(
      `SELECT id FROM \`${table}\` WHERE \`${keyField}\` = ? LIMIT 1`,
      [values[keyField]]
    );
    if (duplicates.length) {
      throw createHttpError(
        `${entityName} for ${values[keyField]} already exists. Use Copy to create a new revision.`
      );
    }

    const insertFields = [...dataFields, 'revision_number', lifecycleField, 'is_default', 'created_date'];
    const insertValues = dataFields.map((field) => values[field]);
    insertValues.push(0, 'Draft', 0, new Date());

    const placeholders = insertFields.map(() => '?').join(', ');
    const [result] = await db.query(
      `INSERT INTO \`${table}\` (${insertFields.map((field) => `\`${field}\``).join(', ')}) VALUES (${placeholders})`,
      insertValues
    );

    return getById(db, result.insertId);
  }

  async function update(db, id, payload) {
    const existing = await fetchById(db, id);
    if (existing[lifecycleField] !== 'Draft') {
      throw createHttpError(`Only Draft ${entityName.toLowerCase()} revisions can be edited.`);
    }

    const values = mapPayload(payload);
    const assignments = [];
    const params = [];

    editableFields.forEach((field) => {
      if (requiredFields.includes(field) && isBlank(values[field])) {
        throw createHttpError(`${fieldLabel(field)} is required.`);
      }
      assignments.push(`\`${field}\` = ?`);
      params.push(values[field]);
    });

    if (!assignments.length) {
      throw createHttpError(`No editable fields were provided for ${entityName.toLowerCase()}.`);
    }

    params.push(Number(id));
    await db.query(`UPDATE \`${table}\` SET ${assignments.join(', ')} WHERE id = ?`, params);

    return getById(db, id);
  }

  async function remove(db, id) {
    const existing = await fetchById(db, id);

    if (existing[lifecycleField] !== 'Draft') {
      throw createHttpError(`Only Draft ${entityName.toLowerCase()} revisions can be deleted.`);
    }

    await db.query(`DELETE FROM \`${table}\` WHERE id = ?`, [Number(id)]);
  }

  async function copy(db, id) {
    const existing = await fetchById(db, id);
    const [[revisionInfo]] = await db.query(
      `SELECT COALESCE(MAX(revision_number), 0) AS maxRevision FROM \`${table}\` WHERE \`${keyField}\` = ?`,
      [existing[keyField]]
    );

    const insertFields = [...dataFields, 'revision_number', lifecycleField, 'is_default', 'created_date'];
    const insertValues = insertFields.map((field) => {
      if (field === 'revision_number') return Number(revisionInfo.maxRevision || 0) + 1;
      if (field === lifecycleField) return 'Draft';
      if (field === 'is_default') return 0;
      if (field === 'created_date') return new Date();
      return existing[field] ?? null;
    });

    const [result] = await db.query(
      `INSERT INTO \`${table}\` (${insertFields.map((field) => `\`${field}\``).join(', ')}) VALUES (${insertFields.map(() => '?').join(', ')})`,
      insertValues
    );

    return getById(db, result.insertId);
  }

  async function changeLifecycle(db, id, nextState) {
    const existing = await fetchById(db, id);
    const currentState = existing[lifecycleField];

    if (nextState === 'Released' && currentState !== 'Draft') {
      throw createHttpError(`Only Draft ${entityName.toLowerCase()} revisions can be released.`);
    }
    if (nextState === 'Archived' && currentState === 'Archived') {
      throw createHttpError(`${entityName} revision is already archived.`);
    }

    const nextDefault = nextState === 'Archived' ? 0 : Number(existing.is_default || 0);
    await db.query(
      `UPDATE \`${table}\` SET \`${lifecycleField}\` = ?, \`is_default\` = ? WHERE id = ?`,
      [nextState, nextDefault, Number(id)]
    );

    return getById(db, id);
  }

  async function activate(db, id) {
    const connection = await db.getConnection();
    let transactionStarted = false;

    try {
      const existing = await fetchById(connection, id);
      if (existing[lifecycleField] !== 'Released') {
        throw createHttpError(`Only Released ${entityName.toLowerCase()} revisions can be activated.`);
      }

      await connection.beginTransaction();
      transactionStarted = true;
      await connection.query(
        `UPDATE \`${table}\` SET \`is_default\` = 0 WHERE \`${keyField}\` = ?`,
        [existing[keyField]]
      );
      await connection.query(
        `UPDATE \`${table}\` SET \`is_default\` = 1 WHERE id = ?`,
        [Number(id)]
      );
      await connection.commit();

      return getById(connection, id);
    } catch (error) {
      if (transactionStarted) {
        await connection.rollback();
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  return {
    list,
    getById,
    create,
    update,
    remove,
    copy,
    release(db, id) {
      return changeLifecycle(db, id, 'Released');
    },
    archive(db, id) {
      return changeLifecycle(db, id, 'Archived');
    },
    activate
  };
}

module.exports = createProductConfigModel;
