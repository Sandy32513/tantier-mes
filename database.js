const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// ── Structured Logger ──────────────────────────────────────
const log = {
  info(msg, meta = {}) {
    const ts = new Date().toISOString();
    const extra = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    console.log(`[${ts}] [INFO]  ${msg}${extra}`);
  },
  warn(msg, meta = {}) {
    const ts = new Date().toISOString();
    const extra = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    console.warn(`[${ts}] [WARN]  ${msg}${extra}`);
  },
  error(msg, err) {
    const ts = new Date().toISOString();
    const code = err?.code || 'UNKNOWN';
    const detail = err?.sqlMessage || err?.message || String(err);
    const stack = err?.stack ? `\n${err.stack}` : '';
    console.error(`[${ts}] [ERROR] ${msg} | code=${code} | ${detail}${stack}`);
  }
};

// ── Validate Environment Variables ─────────────────────────
function loadDbConfig() {
  const required = {
    DB_HOST:     process.env.DB_HOST,
    DB_USER:     process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME:     process.env.DB_NAME
  };

  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    const err = new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      `Copy .env.example to .env and fill in all values before starting.`
    );
    err.code = 'ENV_MISSING';
    throw err;
  }

  return {
    host: required.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: required.DB_USER,
    password: required.DB_PASSWORD,
    database: required.DB_NAME
  };
}

let dbConfig;
let lastDbError = null;
try {
  dbConfig = loadDbConfig();
} catch (e) {
  lastDbError = e;
  log.error('Environment validation failed', e);
  // Defer crash — let server.js decide what to do
  dbConfig = null;
}

const dbName = process.env.DB_NAME || null;

// ── Connection Pool ────────────────────────────────────────
let pool = null;
let poolStatus = 'DOWN';   // 'DOWN' | 'UP' | 'DEGRADED'

function getPool() {
  if (!pool && dbConfig) {
    pool = mysql.createPool({
      host:              dbConfig.host,
      port:              dbConfig.port,
      user:              dbConfig.user,
      password:          dbConfig.password,
      database:          dbConfig.database,
      waitForConnections: true,
      connectionLimit:   10,
      queueLimit:        0,
      connectTimeout:    10000,
      enableKeepAlive:   true,
      keepAliveInitialDelay: 30000
    });
  }
  return pool;
}

// ── Retry with Exponential Backoff ─────────────────────────
const RETRY_MAX_ATTEMPTS = 5;
const RETRY_BASE_MS      = 1000;
const RETRY_MAX_MS       = 16000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRetryDelay(attempt) {
  const exponential = RETRY_BASE_MS * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 500;
  return Math.min(exponential + jitter, RETRY_MAX_MS);
}

function isRetryableError(err) {
  const retryableCodes = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ECONNRESET',
    'PROTOCOL_CONNECTION_LOST',
    'ER_CON_COUNT_ERROR',
    'ER_HOST_NOT_PRIVILEGED'
  ];
  return retryableCodes.includes(err?.code);
}

function getDbErrorHint(err) {
  if (!err) {
    return null;
  }

  switch (err.code) {
    case 'ENV_MISSING':
      return 'Copy .env.example to .env, then set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME before starting the app.';
    case 'ECONNREFUSED':
      return `MySQL is not accepting connections at ${dbConfig?.host || 'localhost'}:${dbConfig?.port || 3306}. Start the MySQL service and confirm port ${dbConfig?.port || 3306} is listening.`;
    case 'ER_ACCESS_DENIED_ERROR':
      return `MySQL rejected the credentials for user "${dbConfig?.user || 'unknown'}". Verify DB_USER and DB_PASSWORD in .env and make sure that account can connect from localhost.`;
    case 'ER_BAD_DB_ERROR':
      return `Database "${dbName || '<unset>'}" does not exist yet. Run "npm run setup" from the tantier-mes directory to create it.`;
    default:
      return null;
  }
}

function rememberDbError(err) {
  lastDbError = err || null;
}

function buildDbStatusFromError(err) {
  const status = {
    status: 'DOWN',
    message: err?.sqlMessage || err?.message || 'Database unavailable'
  };

  if (err?.code) {
    status.code = err.code;
  }

  const hint = getDbErrorHint(err);
  if (hint) {
    status.hint = hint;
  }

  return status;
}

function logDbFailure(message, err) {
  rememberDbError(err);
  log.error(message, err);

  const hint = getDbErrorHint(err);
  if (hint) {
    log.warn('Database troubleshooting', {
      code: err?.code || 'UNKNOWN',
      hint
    });
  }
}

// ── Core DB Operations ─────────────────────────────────────
async function createDatabaseIfMissing() {
  const adminConfig = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password
  };

  let connection;
  try {
    connection = await mysql.createConnection(adminConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    rememberDbError(null);
    log.info(`Database '${dbName}' ensured`, { host: dbConfig.host });
  } catch (err) {
    logDbFailure(`Failed to create/verify database '${dbName}'`, err);
    throw err;
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) { /* ignore */ }
    }
  }
}

async function validatePool(p) {
  const [rows] = await p.query('SELECT 1 AS ok');
  if (!rows || rows.length === 0 || rows[0].ok !== 1) {
    throw new Error('Pool validation query returned unexpected result');
  }
}

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
  const db = getPool();
  for (const statement of statements) {
    await db.query(statement);
  }
}

async function ensureColumn(tableName, columnName, definition) {
  const db = getPool();
  const [rows] = await db.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
     LIMIT 1`,
    [dbName, tableName, columnName]
  );

  if (rows.length === 0) {
    await db.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
  }
}

async function ensureUploadSchema() {
  const uploadColumns = [
    ['tool_groups', 'item_subcategory', 'VARCHAR(100) NULL'],
    ['tool_groups', 'tool_group_item_code', 'VARCHAR(100) NULL'],
    ['tool_groups', 'track_by', 'VARCHAR(50) NULL'],
    ['tool_groups', 'tool_life', 'INT NULL'],
    ['tool_groups', 'calibration_trigger', 'VARCHAR(100) NULL'],
    ['tool_groups', 'tool_group_description', 'VARCHAR(255) NULL'],
    ['tools', 'tracking_number', 'VARCHAR(100) NULL'],
    ['tools', 'date_acquired', 'DATE NULL'],
    ['tools', 'last_calibration_date', 'DATE NULL'],
    ['tools', 'remaining_tool_life', 'INT NULL'],
    ['equipment_groups', 'item_subcategory', 'VARCHAR(100) NULL'],
    ['equipment_groups', 'equipment_group_code', 'VARCHAR(100) NULL'],
    ['equipment_groups', 'equipment_group_description', 'VARCHAR(255) NULL'],
    ['equipment_groups', 'setup_time', 'DECIMAL(10,2) NULL'],
    ['equipment_groups', 'cost_per_hour', 'DECIMAL(10,2) NULL'],
    ['equipment', 'tracking_number', 'VARCHAR(100) NULL'],
    ['equipment', 'production_line', 'VARCHAR(150) NULL'],
    ['equipment', 'efficiency_percentage', 'DECIMAL(5,2) NULL'],
    ['equipment', 'effectivity_date', 'DATE NULL'],
    ['equipment', 'maximum_component_limit', 'INT NULL']
  ];

  for (const [tableName, columnName, definition] of uploadColumns) {
    await ensureColumn(tableName, columnName, definition);
  }
}

async function ensureProductConfigurationSchema() {
  const productConfigColumns = [
    ['manufacturing_routes', 'code', 'VARCHAR(100) NOT NULL'],
    ['manufacturing_routes', 'description', 'VARCHAR(255) NOT NULL'],
    ['manufacturing_routes', 'revision_number', 'INT NOT NULL DEFAULT 0'],
    ['manufacturing_routes', 'status', "VARCHAR(50) NOT NULL DEFAULT 'Draft'"],
    ['manufacturing_routes', 'is_default', 'BOOLEAN DEFAULT FALSE'],
    ['manufacturing_routes', 'created_date', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['bill_of_materials', 'item_code', 'VARCHAR(100) NOT NULL'],
    ['bill_of_materials', 'description', 'VARCHAR(255) NOT NULL'],
    ['bill_of_materials', 'revision_number', 'INT NOT NULL DEFAULT 0'],
    ['bill_of_materials', 'remarks', "VARCHAR(255) DEFAULT ''"],
    ['bill_of_materials', 'state', "VARCHAR(50) NOT NULL DEFAULT 'Draft'"],
    ['bill_of_materials', 'is_default', 'BOOLEAN DEFAULT FALSE'],
    ['bill_of_materials', 'created_date', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['product_specs', 'item_code', 'VARCHAR(100) NOT NULL'],
    ['product_specs', 'description', 'VARCHAR(255) NOT NULL'],
    ['product_specs', 'revision_number', 'INT NOT NULL DEFAULT 0'],
    ['product_specs', 'state', "VARCHAR(50) NOT NULL DEFAULT 'Draft'"],
    ['product_specs', 'is_default', 'BOOLEAN DEFAULT FALSE'],
    ['product_specs', 'effectivity_start_date', 'DATE NULL'],
    ['product_specs', 'effectivity_end_date', 'DATE NULL'],
    ['product_specs', 'created_date', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['common_product_specs', 'code', 'VARCHAR(100) NOT NULL'],
    ['common_product_specs', 'description', 'VARCHAR(255) NOT NULL'],
    ['common_product_specs', 'revision_number', 'INT NOT NULL DEFAULT 0'],
    ['common_product_specs', 'state', "VARCHAR(50) NOT NULL DEFAULT 'Draft'"],
    ['common_product_specs', 'is_default', 'BOOLEAN DEFAULT FALSE'],
    ['common_product_specs', 'created_date', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ['packing_specs', 'name', 'VARCHAR(150) NOT NULL'],
    ['packing_specs', 'code', 'VARCHAR(100) NOT NULL'],
    ['packing_specs', 'dimension', "VARCHAR(150) DEFAULT ''"],
    ['packing_specs', 'is_ng_packing', 'BOOLEAN DEFAULT FALSE'],
    ['packing_specs', 'revision_number', 'INT NOT NULL DEFAULT 0'],
    ['packing_specs', 'state', "VARCHAR(50) NOT NULL DEFAULT 'Draft'"],
    ['packing_specs', 'is_default', 'BOOLEAN DEFAULT FALSE'],
    ['packing_specs', 'created_date', 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP']
  ];

  for (const [tableName, columnName, definition] of productConfigColumns) {
    await ensureColumn(tableName, columnName, definition);
  }
}

async function seedIfEmpty(tableName, columns, rows) {
  const db = getPool();
  const [[countRow]] = await db.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``);
  if (countRow.count > 0 || rows.length === 0) return;

  const ph = `(${columns.map(() => '?').join(',')})`;
  const sql = `INSERT INTO \`${tableName}\` (${columns.join(', ')}) VALUES ${rows.map(() => ph).join(',')}`;
  await db.query(sql, rows.flat());
}

async function ensureRows(tableName, keyColumn, columns, rows) {
  const db = getPool();
  for (const row of rows) {
    const keyIndex = columns.indexOf(keyColumn);
    if (keyIndex === -1) continue;
    const keyValue = row[keyIndex];
    const [[existing]] = await db.query(
      `SELECT id FROM \`${tableName}\` WHERE \`${keyColumn}\` = ? ORDER BY id ASC LIMIT 1`,
      [keyValue]
    );

    if (!existing) {
      const ph = `(${columns.map(() => '?').join(',')})`;
      await db.query(`INSERT INTO \`${tableName}\` (${columns.join(', ')}) VALUES ${ph}`, row);
      continue;
    }

    const updateColumns = columns.filter(c => c !== keyColumn);
    const updateValues  = updateColumns.map(c => row[columns.indexOf(c)] ?? null);
    const sql = `UPDATE \`${tableName}\` SET ${updateColumns.map(c => `\`${c}\` = ?`).join(', ')} WHERE id = ?`;
    await db.query(sql, [...updateValues, existing.id]);
  }
}

async function seedDatabase() {
  await seedIfEmpty('modules', ['module_name'], [
    ['Planning'],['Execution'],['WIP'],['SPC'],['DCC'],['IIoT'],['CMMS'],['RMS'],['OEE'],['Inventory']
  ]);

  await ensureRows('employees',
    'employee_no',
    ['employee_no','first_name','middle_name','last_name','org_role','extension'],
    [
      ['244387','Pranav','','Varshan K K','OPS-SUP','1001'],
      ['776144','Devivarai','','','SFC Operator','1002'],
      ['700922','Senthilkumar','','Dinesh','OPS-KEY USER','1003'],
      ['243704','Shivamurathy','','','QC SUP','1004'],
      ['205934','Megha','','','OPS-KEY USER','1005'],
      ['796458','Ramya D','','','CNC OPR','1006']
    ]
  );

  await ensureRows('item_categories',
    'code',
    ['code','description','remarks','is_immutable'],
    [
      ['FG','Finished Goods','Finished Goods',0],
      ['SFG','Semi Finished Goods','Semi Finished Goods',0],
      ['RM','Raw Material','Raw Material',0],
      ['BO','Bought Out','Bought out Items',0],
      ['CON','Consumables','Consumables',0],
      ['PKG','Packing Material','Packing Material',0],
      ['MANUAL','Manual Work','Manual work',0],
      ['Equipment','Equipment','System generated item category',1],
      ['Tool','Tool','System generated item category',1]
    ]
  );

  await ensureRows('item_subcategories',
    'code',
    ['item_category','code','description','type'],
    [
      ['SFG','SFG','Semi Finished Goods','Inventory'],
      ['Equipment','QA EQP','Quality Equipment','Asset'],
      ['RM','EXT','Extrusion','Inventory'],
      ['Equipment','BM EQP','Band Manufacturing Equipment','Asset'],
      ['Equipment','ANO EQP','Anodizing Equipment','Asset']
    ]
  );

  await ensureRows('items',
    'item_code',
    ['item_category','item_subcategory','item_code','description','alias','item_source','uom','track_by','is_sold','has_virtual_bom'],
    [
      ['Equipment','ANO EQP','ANO-QD-26','ANO_IPQC_26_DIMENSION_INS','-','Purchased','Unit','Serials',0,0],
      ['SFG','SFG','1600002140','CNC9_BLUE,HSG,ESIM,NM106','-','Manufactured','EA','Batch',0,0],
      ['SFG','SFG','1600002136','CNC9_BLUE,HSG,PSIM,NM106','-','Manufactured','EA','Batch',0,0]
    ]
  );

  await ensureRows('factories',
    'code',
    ['name','code','is_default','is_immutable'],
    [['SS Electronics Main Plant','9010',1,0]]
  );

  await ensureRows('shifts',
    'code',
    ['name','code'],
    [['First Shift','1st shift'],['Second Shift','2nd shift'],['Third Shift','3rd shift']]
  );

  await seedIfEmpty('system_configurations', ['config_name'], [
    ['EmailRecipientList'],['Email'],['DccDocumentRevisionNumber'],['SapIntegrationConfiguration']
  ]);

  await seedIfEmpty('organizational_roles', ['org_structure','reports_to','name','code'], [
    ['SFC Operator','','SFC Operator','SFC OPR'],
    ['OPS Configuration','','OPS Configuration Engineer','OPS-CON'],
    ['QUALITY','','QUALITY INSPECTOR','QC INS'],
    ['QUALITY','','QUALITY SUPERVISOR','QC SUP'],
    ['SECURITY','','SECURITY','SEC'],
    ['STORE AND KITTING','','STORES OPERATOR','STO-OPR'],
    ['BAND MANUFACTURING PRODUCTION','','PRODUCTION OPERATOR','PROD OPR'],
    ['BAND MANUFACTURING PRODUCTION','','PRODUCTION SUPERVISOR','PROD-SUP']
  ]);

  const db = getPool();
  await db.query(
    "UPDATE `employees` SET `org_role` = REPLACE(`org_role`, 'MES', 'OPS') WHERE `org_role` LIKE '%MES%'"
  );
  await db.query(
    "UPDATE `organizational_roles` SET `org_structure` = 'OPS Configuration', `name` = 'OPS Configuration Engineer', `code` = 'OPS-CON' WHERE `code` = 'MES-CON' OR `name` = 'MES Configuration Engineer' OR `org_structure` = 'MES Configuration'"
  );

  await seedIfEmpty('custom_tables', ['name','date_from','date_to','is_active'], [
    ['SAP_Jobordervalue','2026-02-28',null,1],
    ['Multiple_JO','2025-03-15',null,1],
    ['TracePassedScenario','2025-03-15',null,1],
    ['GenericTransactionValues','2024-11-15',null,1],
    ['BINVvalidationSetup','2024-09-29',null,1],
    ['EngineeringCode','2024-09-29',null,1]
  ]);

  await seedIfEmpty('control_numbers', ['type','format','counter','alphanumeric_counter'], [
    ['Job Order','{Series}',1,''],
    ['Inventory Transaction','{Series}',335663,''],
    ['Sales Order','{Series}',1,''],
    ['Purchase Order','{Series}',1,''],
    ['Equipment','{0}',11,''],
    ['Tool','{0}',1,''],
    ['Final Pallet','{0}',1,''],
    ['Dispatch Plan Detail','{prodlinedesc}-{series:000000}',1,'']
  ]);

  await seedIfEmpty('skills', ['name','code','description'], [
    ['Machine Operation','MO','Skill for operating CNC and production machines'],
    ['Quality Inspection','QI','Skill for performing quality checks and inspections'],
    ['Assembly','ASM','Manual and semi-automated assembly skill']
  ]);

  await seedIfEmpty('skillsets', ['name','code','description'], [
    ['CNC Operator Skillset','CNC-SKS','Full skillset required for CNC machine operators'],
    ['Quality Supervisor Skillset','QS-SKS','Skillset for quality supervisors']
  ]);

  await seedIfEmpty('tool_groups', ['name','code','description'], [
    ['Cutting Tools','CTG','Group for all cutting tools'],
    ['Measuring Tools','MTG','Group for precision measuring instruments'],
    ['Hand Tools','HTG','Group for general hand tools']
  ]);

  await seedIfEmpty('equipment_groups', ['name','code','description'], [
    ['CNC Machines','CNC-GRP','Group for all CNC machining centres'],
    ['Anodizing Equipment','ANO-GRP','Group for anodizing line equipment'],
    ['Quality Equipment','QA-GRP','Group for quality assurance equipment']
  ]);

  await seedIfEmpty('processes', ['name','code','description','process_type'], [
    ['CNC Machining','CNC','Computer numerical control machining process','Manufacturing'],
    ['Anodizing','ANO','Electrochemical surface finishing process','Surface Treatment'],
    ['Quality Inspection','QI','Final inspection before packaging','Quality'],
    ['Assembly','ASM','Component assembly process','Assembly']
  ]);

  await seedIfEmpty('production_lines', ['factory','name','code','description','is_active'], [
    ['9010','Band Manufacturing Line 1','BML-01','Primary band manufacturing production line',1],
    ['9010','Anodizing Line 1','ANO-01','Main anodizing production line',1],
    ['9010','Final Assembly Line','FAL-01','Final product assembly and packaging line',1]
  ]);

  await seedIfEmpty('manufacturing_routes', ['code','description','revision_number','status','is_default','created_date'], [
    ['ANO-AT','ANO-AT',6,'Released',1,'2026-03-01 09:00:00'],
    ['CNC9 - MAIN ASSY','CNC9 - MAIN ASSY',9,'Released',1,'2026-03-02 10:00:00'],
    ['BM-QC-06','BM_IPQC_6_COSMETIC INSPECTION',1,'Released',0,'2026-02-24 11:15:00'],
    ['ANO - CNC9','ANO - CNC9',4,'Archived',0,'2026-01-16 08:30:00'],
    ['IM - BMB2','IM - BMB2',1,'Released',0,'2026-02-14 15:20:00'],
    ['IM - BMB2','IM - BMB2',0,'Archived',0,'2026-01-08 12:10:00']
  ]);

  await seedIfEmpty('bill_of_materials', ['item_code','description','revision_number','remarks','state','is_default','created_date'], [
    ['1600002140','CNC9,BLUE,HSG,ESIM,NM106',0,'Primary released BOM','Released',1,'2026-03-01 09:00:00'],
    ['1600002136','CNC9,BLUE,HSG,PSIM,NM106',0,'Released baseline','Released',1,'2026-03-01 09:05:00'],
    ['1600002132','CNC9,GREEN,HSG,ESIM,NM106',0,'Released baseline','Released',0,'2026-02-27 14:30:00'],
    ['1600002128','CNC9,GREEN,HSG,PSIM,NM106',1,'Updated fastener stack','Draft',0,'2026-03-09 11:20:00'],
    ['1600002139','ANO,BLUE,HSG,ESIM,NM106',0,'Legacy revision','Archived',0,'2026-01-30 16:40:00'],
    ['1600002135','ANO,BLUE,HSG,PSIM,NM106',0,'Released BOM','Released',1,'2026-02-18 13:15:00']
  ]);

  await seedIfEmpty('product_specs', ['item_code','description','revision_number','state','is_default','effectivity_start_date','effectivity_end_date','created_date'], [
    ['1600002135','ANO,BLUE,HSG,PSIM,NM106',1,'Released',1,'2026-03-01',null,'2026-03-01 09:10:00'],
    ['1600002131','ANO,GREEN,HSG,PSIM,NM106',1,'Released',1,'2026-03-01',null,'2026-03-01 09:15:00'],
    ['1600002107','ANO,NDA,HSG,PSIM,NM106',2,'Archived',0,'2025-12-01','2026-02-28','2026-02-10 14:35:00'],
    ['1600002035','CNC9,BLACK,HSG,ESIM,NM106',3,'Draft',0,'2026-03-15',null,'2026-03-10 10:25:00']
  ]);

  await seedIfEmpty('common_product_specs', ['code','description','revision_number','state','is_default','created_date'], [
    ['BM-QC-25','BM_IPQC_25_KPOV',0,'Released',1,'2026-03-01 09:20:00'],
    ['ANO-VIQ-OK','VI_QC_OVERALL_KILL_RATE',0,'Released',1,'2026-03-01 09:22:00'],
    ['BM-QC-06','BM_IPQC_6_COSMETIC INSPECTION',1,'Archived',0,'2026-02-18 16:00:00'],
    ['ANO-FA-10','BM_IPQC_10_FA LAB',1,'Draft',0,'2026-03-09 12:00:00']
  ]);

  await seedIfEmpty('packing_specs', ['name','code','dimension','is_ng_packing','revision_number','state','is_default','created_date'], [
    ['NG Packing MCH ESIM','NG-MCH-ESIM','245x170x20',0,0,'Released',1,'2026-03-01 09:30:00'],
    ['NG Packing MCH PSIM','NG-MCH-PSIM','245x170x20',1,0,'Released',1,'2026-03-01 09:35:00'],
    ['CNC4 TO ANO BLUE ESIM DVT','PK-CNC4-ANO-BE','300x210x40',0,1,'Draft',0,'2026-03-10 11:40:00'],
    ['CNC4 TO ANO GREEN PSIM DVT','PK-CNC4-ANO-GP','300x210x40',0,0,'Archived',0,'2026-02-20 08:50:00']
  ]);
}

// ── initDatabase with Retry Logic ──────────────────────────
async function initDatabase() {
  // Phase 0: Validate config
  if (!dbConfig) {
    const err = new Error(
      'Database configuration is missing. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env'
    );
    err.code = 'ENV_MISSING';
    throw err;
  }

  // Phase 1: Create database with retry
  for (let attempt = 1; attempt <= RETRY_MAX_ATTEMPTS; attempt++) {
    try {
      log.info(`DB init attempt ${attempt}/${RETRY_MAX_ATTEMPTS}`, { host: dbConfig.host, db: dbName });
      await createDatabaseIfMissing();
      break;
    } catch (err) {
      if (attempt === RETRY_MAX_ATTEMPTS) {
        logDbFailure('All DB creation attempts exhausted', err);
        throw err;
      }
      if (!isRetryableError(err)) {
        logDbFailure('Non-retryable error during DB creation', err);
        throw err;
      }
      const delay = getRetryDelay(attempt);
      log.warn(`DB creation failed (attempt ${attempt}), retrying in ${Math.round(delay)}ms`, {
        code: err.code
      });
      await sleep(delay);
    }
  }

  // Phase 2: Create pool and validate with test query
  const p = getPool();
  try {
    await validatePool(p);
    rememberDbError(null);
    log.info('Connection pool validated (SELECT 1 OK)');
  } catch (err) {
    logDbFailure('Pool validation failed', err);
    throw err;
  }

  // Phase 3: Run schema setup
  try {
    await runSqlFile(path.join(__dirname, 'scripts', 'setup-db.sql'));
    log.info('Base schema (setup-db.sql) applied');
  } catch (err) {
    log.error('Failed to run setup-db.sql', err);
    throw err;
  }

  // Phase 4: Ensure extended schemas
  try {
    await ensureUploadSchema();
    log.info('Upload schema columns ensured');
  } catch (err) {
    log.error('Failed to ensure upload schema', err);
    throw err;
  }

  try {
    await ensureProductConfigurationSchema();
    log.info('Product configuration schema columns ensured');
  } catch (err) {
    log.error('Failed to ensure product configuration schema', err);
    throw err;
  }

  // Phase 5: Seed data
  try {
    await seedDatabase();
    log.info('Seed data applied (idempotent)');
  } catch (err) {
    log.error('Failed to seed database', err);
    throw err;
  }

  poolStatus = 'UP';
  rememberDbError(null);
  log.info('Database initialization complete', { status: poolStatus, db: dbName });
  return p;
}

// ── Health Check ───────────────────────────────────────────
async function getDbStatus() {
  const p = getPool();
  if (!p) {
    if (lastDbError) {
      return buildDbStatusFromError(lastDbError);
    }
    return { status: 'DOWN', message: 'Connection pool not initialized' };
  }
  try {
    await validatePool(p);
    poolStatus = 'UP';
    rememberDbError(null);
    return { status: 'UP', message: 'Database reachable' };
  } catch (err) {
    poolStatus = 'DOWN';
    rememberDbError(err);
    return buildDbStatusFromError(err);
  }
}

// ── Close Pool ─────────────────────────────────────────────
async function closePool() {
  if (pool) {
    try {
      await pool.end();
      log.info('Connection pool closed');
    } catch (err) {
      log.error('Error closing connection pool', err);
    } finally {
      pool = null;
      poolStatus = 'DOWN';
    }
  }
}

// ── Exports ────────────────────────────────────────────────
module.exports = {
  dbName,
  initDatabase,
  closePool,
  getPool,
  getDbStatus,
  getDbErrorHint,
  dbConfig,
  log
};
