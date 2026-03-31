const { parseSpreadsheet } = require('../services/excelParser');

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeLookup(value) {
  return normalizeText(value).toLowerCase();
}

function formatDateParts(year, month, day) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const date = new Date(Date.UTC(y, m - 1, d));

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function excelSerialToIsoDate(serial) {
  if (!Number.isFinite(serial) || serial <= 0) {
    return null;
  }

  const utcDays = Math.floor(serial - 25569);
  const utcMilliseconds = utcDays * 86400 * 1000;
  const date = new Date(utcMilliseconds);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return formatDateParts(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate()
  );
}

function parseIsoDate(value) {
  if (value == null || value === '') return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const raw = normalizeText(value);
  if (!raw) return null;

  if (/^\d+(\.\d+)?$/.test(raw)) {
    return excelSerialToIsoDate(Number(raw));
  }

  let match = raw.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (match) {
    return formatDateParts(match[1], match[2], match[3]);
  }

  match = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    return formatDateParts(match[3], match[2], match[1]);
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return null;
}

function parseInteger(value) {
  const raw = normalizeText(value);
  if (!raw) return null;
  const number = Number(raw);
  if (!Number.isFinite(number) || !Number.isInteger(number)) {
    return null;
  }
  return number;
}

function parseDecimal(value) {
  const raw = normalizeText(value);
  if (!raw) return null;
  const number = Number(raw);
  if (!Number.isFinite(number)) {
    return null;
  }
  return Number(number.toFixed(2));
}

async function createLookupSet(db, query, columns) {
  const [rows] = await db.query(query);
  const values = new Set();

  rows.forEach((row) => {
    columns.forEach((column) => {
      const value = normalizeLookup(row[column]);
      if (value) {
        values.add(value);
      }
    });
  });

  return values;
}

function summarizeRows(rows) {
  const invalidRows = rows.filter((row) => row.errors.length > 0).length;

  return {
    totalRows: rows.length,
    validRows: rows.length - invalidRows,
    invalidRows
  };
}

const uploadConfigs = {
  'tool-group': {
    entityLabel: 'Tool Group',
    table: 'tool_groups',
    uniqueField: 'tool_group_item_code',
    uniqueLabel: 'Tool Group Item Code',
    fields: [
      { key: 'item_subcategory', label: 'Item Subcategory', aliases: ['Item Subcategory Code'] },
      { key: 'tool_group_item_code', label: 'Tool Group Item Code', aliases: ['Tool Group Code'] },
      { key: 'track_by', label: 'Track By' },
      { key: 'tool_life', label: 'Tool Life' },
      { key: 'calibration_trigger', label: 'Calibration Trigger' },
      { key: 'tool_group_description', label: 'Tool Group Description', aliases: ['Description'] }
    ],
    async loadContext(db) {
      const [itemSubcategories, existingKeys] = await Promise.all([
        createLookupSet(db, 'SELECT code, description FROM item_subcategories', ['code', 'description']),
        createLookupSet(db, 'SELECT code, tool_group_item_code FROM tool_groups', ['code', 'tool_group_item_code'])
      ]);

      return { itemSubcategories, existingKeys };
    },
    validate(values, context, addError) {
      if (!context.itemSubcategories.has(normalizeLookup(values.item_subcategory))) {
        addError('Item Subcategory does not exist.');
      }

      const toolLife = parseInteger(values.tool_life);
      if (toolLife == null || toolLife < 0) {
        addError('Tool Life must be a whole number greater than or equal to 0.');
      } else {
        values.tool_life = toolLife;
      }
    },
    toDatabaseRow(values) {
      return {
        name: values.tool_group_description || values.tool_group_item_code,
        code: values.tool_group_item_code,
        description: values.tool_group_description,
        item_subcategory: values.item_subcategory,
        tool_group_item_code: values.tool_group_item_code,
        track_by: values.track_by,
        tool_life: values.tool_life,
        calibration_trigger: values.calibration_trigger,
        tool_group_description: values.tool_group_description
      };
    }
  },
  'tool': {
    entityLabel: 'Tool',
    table: 'tools',
    uniqueField: 'tracking_number',
    uniqueLabel: 'Tracking Number',
    fields: [
      { key: 'tool_group', label: 'Tool Group', aliases: ['Tool Group Code'] },
      { key: 'tracking_number', label: 'Tracking Number', aliases: ['Tool Tracking Number'] },
      { key: 'date_acquired', label: 'Date Acquired' },
      { key: 'last_calibration_date', label: 'Last Calibration Date' },
      { key: 'remaining_tool_life', label: 'Remaining Tool Life' }
    ],
    async loadContext(db) {
      const [toolGroups, existingKeys] = await Promise.all([
        createLookupSet(db, 'SELECT code, name, tool_group_item_code FROM tool_groups', ['code', 'name', 'tool_group_item_code']),
        createLookupSet(db, 'SELECT code, tracking_number, serial_no FROM tools', ['code', 'tracking_number', 'serial_no'])
      ]);

      return { toolGroups, existingKeys };
    },
    validate(values, context, addError) {
      if (!context.toolGroups.has(normalizeLookup(values.tool_group))) {
        addError('Tool Group does not exist.');
      }

      const dateAcquired = parseIsoDate(values.date_acquired);
      if (!dateAcquired) {
        addError('Date Acquired must be a valid date.');
      } else {
        values.date_acquired = dateAcquired;
      }

      const lastCalibrationDate = parseIsoDate(values.last_calibration_date);
      if (!lastCalibrationDate) {
        addError('Last Calibration Date must be a valid date.');
      } else {
        values.last_calibration_date = lastCalibrationDate;
      }

      const remainingToolLife = parseInteger(values.remaining_tool_life);
      if (remainingToolLife == null || remainingToolLife < 0) {
        addError('Remaining Tool Life must be a whole number greater than or equal to 0.');
      } else {
        values.remaining_tool_life = remainingToolLife;
      }
    },
    toDatabaseRow(values) {
      return {
        tool_group: values.tool_group,
        name: values.tracking_number,
        code: values.tracking_number,
        description: '',
        uom: '',
        is_active: 1,
        tracking_number: values.tracking_number,
        date_acquired: values.date_acquired,
        last_calibration_date: values.last_calibration_date,
        remaining_tool_life: values.remaining_tool_life
      };
    }
  },
  'equipment-group': {
    entityLabel: 'Equipment Group',
    table: 'equipment_groups',
    uniqueField: 'equipment_group_code',
    uniqueLabel: 'Equipment Group Code',
    fields: [
      { key: 'item_subcategory', label: 'Item Subcategory', aliases: ['Item Subcategory Code'] },
      { key: 'equipment_group_code', label: 'Equipment Group Code', aliases: ['Equipment Group Item Code'] },
      { key: 'equipment_group_description', label: 'Equipment Group Description', aliases: ['Description'] },
      { key: 'setup_time', label: 'Setup Time' },
      { key: 'cost_per_hour', label: 'Cost Per Hour' }
    ],
    async loadContext(db) {
      const [itemSubcategories, existingKeys] = await Promise.all([
        createLookupSet(db, 'SELECT code, description FROM item_subcategories', ['code', 'description']),
        createLookupSet(db, 'SELECT code, equipment_group_code FROM equipment_groups', ['code', 'equipment_group_code'])
      ]);

      return { itemSubcategories, existingKeys };
    },
    validate(values, context, addError) {
      if (!context.itemSubcategories.has(normalizeLookup(values.item_subcategory))) {
        addError('Item Subcategory does not exist.');
      }

      const setupTime = parseDecimal(values.setup_time);
      if (setupTime == null || setupTime < 0) {
        addError('Setup Time must be a number greater than or equal to 0.');
      } else {
        values.setup_time = setupTime;
      }

      const costPerHour = parseDecimal(values.cost_per_hour);
      if (costPerHour == null || costPerHour < 0) {
        addError('Cost Per Hour must be a number greater than or equal to 0.');
      } else {
        values.cost_per_hour = costPerHour;
      }
    },
    toDatabaseRow(values) {
      return {
        name: values.equipment_group_description || values.equipment_group_code,
        code: values.equipment_group_code,
        description: values.equipment_group_description,
        item_subcategory: values.item_subcategory,
        equipment_group_code: values.equipment_group_code,
        equipment_group_description: values.equipment_group_description,
        setup_time: values.setup_time,
        cost_per_hour: values.cost_per_hour
      };
    }
  },
  'equipment': {
    entityLabel: 'Equipment',
    table: 'equipment',
    uniqueField: 'tracking_number',
    uniqueLabel: 'Tracking Number',
    fields: [
      { key: 'equipment_group', label: 'Equipment Group', aliases: ['Equipment Group Code'] },
      { key: 'tracking_number', label: 'Tracking Number', aliases: ['Equipment Tracking Number'] },
      { key: 'production_line', label: 'Production Line', aliases: ['Production Line Code'] },
      { key: 'efficiency_percentage', label: 'Efficiency (%)', aliases: ['Efficiency', 'Efficiency Percentage'] },
      { key: 'effectivity_date', label: 'Effectivity Date' },
      { key: 'maximum_component_limit', label: 'Maximum Component Limit' }
    ],
    async loadContext(db) {
      const [equipmentGroups, productionLines, existingKeys] = await Promise.all([
        createLookupSet(db, 'SELECT code, name, equipment_group_code FROM equipment_groups', ['code', 'name', 'equipment_group_code']),
        createLookupSet(db, 'SELECT code, name FROM production_lines', ['code', 'name']),
        createLookupSet(db, 'SELECT code, tracking_number, serial_no FROM equipment', ['code', 'tracking_number', 'serial_no'])
      ]);

      return { equipmentGroups, productionLines, existingKeys };
    },
    validate(values, context, addError) {
      if (!context.equipmentGroups.has(normalizeLookup(values.equipment_group))) {
        addError('Equipment Group does not exist.');
      }

      if (!context.productionLines.has(normalizeLookup(values.production_line))) {
        addError('Production Line does not exist.');
      }

      const efficiency = parseDecimal(values.efficiency_percentage);
      if (efficiency == null || efficiency < 0 || efficiency > 100) {
        addError('Efficiency (%) must be a number between 0 and 100.');
      } else {
        values.efficiency_percentage = efficiency;
      }

      const effectivityDate = parseIsoDate(values.effectivity_date);
      if (!effectivityDate) {
        addError('Effectivity Date must be a valid date.');
      } else {
        values.effectivity_date = effectivityDate;
      }

      const maximumComponentLimit = parseInteger(values.maximum_component_limit);
      if (maximumComponentLimit == null || maximumComponentLimit < 0) {
        addError('Maximum Component Limit must be a whole number greater than or equal to 0.');
      } else {
        values.maximum_component_limit = maximumComponentLimit;
      }
    },
    toDatabaseRow(values) {
      return {
        equipment_group: values.equipment_group,
        name: values.tracking_number,
        code: values.tracking_number,
        description: '',
        serial_no: values.tracking_number,
        is_active: 1,
        tracking_number: values.tracking_number,
        production_line: values.production_line,
        efficiency_percentage: values.efficiency_percentage,
        effectivity_date: values.effectivity_date,
        maximum_component_limit: values.maximum_component_limit
      };
    }
  }
};

function getUploadConfig(type) {
  const config = uploadConfigs[type];
  if (!config) {
    throw new Error(`Unsupported upload type: ${type}`);
  }
  return config;
}

function normalizeRowValues(config, rawValues) {
  const normalizedValues = {};
  config.fields.forEach((field) => {
    normalizedValues[field.key] = normalizeText(rawValues[field.key]);
  });
  return normalizedValues;
}

async function validateRows(config, db, rawRows) {
  const context = await config.loadContext(db);
  const uniqueCounts = new Map();

  rawRows.forEach((rawRow) => {
    const rowValues = rawRow.values || rawRow;
    const uniqueValue = normalizeLookup(rowValues[config.uniqueField]);
    if (!uniqueValue) return;
    uniqueCounts.set(uniqueValue, (uniqueCounts.get(uniqueValue) || 0) + 1);
  });

  return rawRows.map((rawRow, index) => {
    const rowNumber = Number(rawRow.rowNumber || rawRow.row_number || index + 2);
    const values = normalizeRowValues(config, rawRow.values || rawRow);
    const errors = [];
    const addError = (message) => errors.push(message);

    config.fields.forEach((field) => {
      if (field.required === false) return;
      if (!values[field.key]) {
        addError(`${field.label} is required.`);
      }
    });

    const uniqueValue = normalizeLookup(values[config.uniqueField]);
    if (uniqueValue && uniqueCounts.get(uniqueValue) > 1) {
      addError(`${config.uniqueLabel} is duplicated in the file.`);
    }
    if (uniqueValue && context.existingKeys.has(uniqueValue)) {
      addError(`${config.uniqueLabel} already exists in the database.`);
    }

    config.validate(values, context, addError);

    return {
      rowNumber,
      values,
      errors
    };
  });
}

async function insertRows(db, config, rows) {
  const insertableRows = rows.map((row) => config.toDatabaseRow(row.values));
  if (!insertableRows.length) {
    return 0;
  }

  const columns = Object.keys(insertableRows[0]);
  const placeholders = insertableRows
    .map(() => `(${columns.map(() => '?').join(', ')})`)
    .join(', ');
  const values = insertableRows.flatMap((row) => columns.map((column) => row[column] ?? null));

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO \`${config.table}\` (${columns.map((column) => `\`${column}\``).join(', ')}) VALUES ${placeholders}`,
      values
    );
    await connection.commit();
    return insertableRows.length;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function createUploadHandler(type) {
  const config = getUploadConfig(type);

  return async (req, res) => {
    try {
      const db = req.app.locals.db;

      if (req.file) {
        const parsed = parseSpreadsheet(req.file.buffer, config.fields);

        if (parsed.missingHeaders.length > 0) {
          return res.status(400).json({
            error: `Missing required columns: ${parsed.missingHeaders.join(', ')}`
          });
        }

        const rows = await validateRows(config, db, parsed.rows);
        return res.json({
          mode: 'preview',
          entity: config.entityLabel,
          rows,
          summary: summarizeRows(rows)
        });
      }

      const payloadRows = Array.isArray(req.body?.rows) ? req.body.rows : [];
      if (!payloadRows.length) {
        return res.status(400).json({ error: 'No preview rows were provided for posting.' });
      }

      const rows = await validateRows(config, db, payloadRows);
      const summary = summarizeRows(rows);

      if (summary.invalidRows > 0) {
        return res.status(400).json({
          error: 'Validation failed. Resolve the errors before posting.',
          rows,
          summary
        });
      }

      const insertedCount = await insertRows(db, config, rows);
      return res.status(201).json({
        message: `${insertedCount} ${config.entityLabel.toLowerCase()} record(s) posted successfully.`,
        insertedCount
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message || `Failed to process ${config.entityLabel.toLowerCase()} upload.`
      });
    }
  };
}

module.exports = {
  createUploadHandler
};
