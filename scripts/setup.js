const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { dbName, initDatabase, getPool, closePool, log } = require('../database');

dotenv.config();

async function run() {
  log.info('Starting database setup...');

  // Validate required env vars
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    log.error(`Missing required environment variables: ${missing.join(', ')}. Copy .env.example to .env.`);
    process.exit(1);
  }

  try {
    // initDatabase handles: create DB, run setup-db.sql, ensure schemas, seed data
    await initDatabase();

    // Run additional seed-data.sql (idempotent inserts with NOT EXISTS guards)
    const db = getPool();
    const seedSqlPath = path.join(__dirname, 'seed-data.sql');
    if (fs.existsSync(seedSqlPath)) {
      const sql = fs.readFileSync(seedSqlPath, 'utf8');
      const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
      for (const statement of statements) {
        try {
          await db.query(statement);
        } catch (err) {
          log.warn('Seed statement skipped (may already exist)', { error: err.message });
        }
      }
      log.info('Additional seed-data.sql applied');
    }

    log.info('Database setup completed successfully', { database: dbName });
    process.exit(0);
  } catch (error) {
    log.error('Database setup failed', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

run();
