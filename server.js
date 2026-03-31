const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { initDatabase, getDbStatus, closePool, log } = require('./database');

dotenv.config();

function validateServerEnv() {
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    log.error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Copy .env.example to .env and fill in all values.',
      { code: 'ENV_MISSING' }
    );
    return false;
  }

  return true;
}

const employeesRoutes = require('./routes/employees');
const customersRoutes = require('./routes/customers');
const systemConfigRoutes = require('./routes/systemConfig');
const organizationRoleRoutes = require('./routes/organizationRole');
const customTablesRoutes = require('./routes/customTables');
const controlNumbersRoutes = require('./routes/controlNumbers');
const itemCategoriesRoutes = require('./routes/itemCategories');
const itemSubcategoriesRoutes = require('./routes/itemSubcategories');
const itemsRoutes = require('./routes/items');
const factoriesRoutes = require('./routes/factories');
const shiftsRoutes = require('./routes/shifts');
const skillsRoutes = require('./routes/skills');
const skillSetsRoutes = require('./routes/skillsets');
const toolGroupsRoutes = require('./routes/toolGroups');
const toolsRoutes = require('./routes/tools');
const equipmentGroupsRoutes = require('./routes/equipmentGroups');
const equipmentRoutes = require('./routes/equipment');
const processesRoutes = require('./routes/processes');
const productionLinesRoutes = require('./routes/productionLines');
const uploadsRoutes = require('./routes/uploads');
const productConfigurationRoutes = require('./routes/productConfiguration');

const app = express();
const port = Number(process.env.PORT || 3000);

const defaultUserId = process.env.DEFAULT_USER_ID;
const defaultPassword = process.env.DEFAULT_PASSWORD;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const view = (file) => (req, res) => res.sendFile(path.join(__dirname, 'views', file));

app.get('/', view('dashboard.html'));
app.get('/login', view('login.html'));
app.get('/logout', (req, res) => res.redirect('/login'));
app.get('/dashboard', view('dashboard.html'));
app.get('/employees', view('employees.html'));
app.get('/customers', view('customers.html'));
app.get('/system-configuration', view('systemConfig.html'));
app.get('/organizational-role', view('organizationRole.html'));
app.get('/custom-tables', view('customTables.html'));
app.get('/control-numbers', view('controlNumbers.html'));
app.get('/item-categories', view('itemCategories.html'));
app.get('/item-subcategories', view('itemSubcategories.html'));
app.get('/item-master', view('itemMaster.html'));
app.get('/factories', view('factories.html'));
app.get('/shifts', view('shifts.html'));
app.get('/skills', view('skills.html'));
app.get('/skillsets', view('skillsets.html'));
app.get('/tool-groups', view('toolGroups.html'));
app.get('/tools', view('tools.html'));
app.get('/equipment-groups', view('equipmentGroups.html'));
app.get('/equipment', view('equipment.html'));
app.get('/processes', view('processes.html'));
app.get('/production-lines', view('productionLines.html'));
app.get('/factory-uploads/tool-group', view('toolGroupUpload.html'));
app.get('/factory-uploads/tool', view('toolUpload.html'));
app.get('/factory-uploads/equipment-group', view('equipmentGroupUpload.html'));
app.get('/factory-uploads/equipment', view('equipmentUpload.html'));
app.get('/manufacturing-route', view('manufacturingRoute.html'));
app.get('/bill-of-materials', view('billOfMaterials.html'));
app.get('/product-spec', view('productSpec.html'));
app.get('/common-product-spec', view('commonProductSpec.html'));
app.get('/packing-spec', view('packingSpec.html'));
app.get('/job-orders', view('jobOrders.html'));
app.get('/lot-list', view('lotList.html'));
app.get('/move-lot', view('moveLot.html'));
app.get('/shopfloor-console', view('shopfloorConsole.html'));

app.get('/ManufacturingRoute', view('manufacturingRoute.html'));
app.get('/BillOfMaterials', view('billOfMaterials.html'));
app.get('/ProductSpec', view('productSpec.html'));
app.get('/CommonProductSpec', view('commonProductSpec.html'));
app.get('/PackingSpec', view('packingSpec.html'));
app.get('/JobOrder', view('jobOrders.html'));
app.get('/JobOrders', view('jobOrders.html'));
app.get('/LotList', view('lotList.html'));
app.get('/Lotlist', view('lotList.html'));
app.get('/MoveLot', view('moveLot.html'));
app.get('/ShopfloorConsole', view('shopfloorConsole.html'));
app.get('/ShopFloorConsole', view('shopfloorConsole.html'));

app.get('/health', async (req, res) => {
  const dbHealth = await getDbStatus();
  const httpStatus = dbHealth.status === 'UP' ? 200 : 503;

  res.status(httpStatus).json({
    service: 'Operon OPS 1.0',
    status: dbHealth.status === 'UP' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    database: dbHealth,
    uptime: Math.round(process.uptime())
  });
});

app.post('/api/login', (req, res) => {
  const userId = String(req.body.userId ?? '').trim();
  const password = String(req.body.password ?? '');

  if (!/^\d+$/.test(userId)) {
    return res.status(400).json({ error: 'User ID must contain only numbers.' });
  }

  if (!/[A-Za-z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain letters.' });
  }

  if (!defaultUserId || !defaultPassword) {
    return res.status(500).json({
      error: 'Login is not configured. Set DEFAULT_USER_ID and DEFAULT_PASSWORD in .env.'
    });
  }

  if (userId !== defaultUserId || password !== defaultPassword) {
    return res.status(401).json({ error: 'Invalid User ID or Password.' });
  }

  return res.json({ success: true, redirect: '/dashboard' });
});

function requireDb(req, res, next) {
  if (!req.app.locals.db) {
    return res.status(503).json({
      error: 'Database is not available. The service is running but cannot process data requests.',
      hint: 'Check /health for database status and run "npm run setup" after MySQL is available.'
    });
  }

  next();
}

const dbBackedApiRoutes = [
  ['/api/employees', employeesRoutes],
  ['/api/customers', customersRoutes],
  ['/api/system-configurations', systemConfigRoutes],
  ['/api/organizational-roles', organizationRoleRoutes],
  ['/api/custom-tables', customTablesRoutes],
  ['/api/control-numbers', controlNumbersRoutes],
  ['/api/item-categories', itemCategoriesRoutes],
  ['/api/item-subcategories', itemSubcategoriesRoutes],
  ['/api/items', itemsRoutes],
  ['/api/factories', factoriesRoutes],
  ['/api/shifts', shiftsRoutes],
  ['/api/skills', skillsRoutes],
  ['/api/skillsets', skillSetsRoutes],
  ['/api/tool-groups', toolGroupsRoutes],
  ['/api/tools', toolsRoutes],
  ['/api/equipment-groups', equipmentGroupsRoutes],
  ['/api/equipment', equipmentRoutes],
  ['/api/processes', processesRoutes],
  ['/api/production-lines', productionLinesRoutes],
  ['/api/upload', uploadsRoutes],
  ['/api', productConfigurationRoutes]
];

for (const [routePath, router] of dbBackedApiRoutes) {
  app.use(routePath, requireDb, router);
}

app.get('/api/modules', requireDb, async (req, res) => {
  try {
    const [rows] = await req.app.locals.db.query('SELECT module_name FROM modules ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    log.error('Failed to fetch modules', err);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

async function startServer() {
  const envValid = validateServerEnv();
  app.locals.db = null;

  try {
    const { refreshProjectProgress } = require('./scripts/progress-update');
    refreshProjectProgress({ silent: true });
  } catch (progressError) {
    log.warn('Project progress refresh skipped', { message: progressError.message });
  }

  const server = app.listen(port, () => {
    log.info(`Operon OPS 1.0 running on http://localhost:${port}`, {
      port,
      database: envValid ? 'initializing' : 'unavailable'
    });
  });

  server.on('error', (error) => {
    if (error?.code === 'EADDRINUSE') {
      log.error(`Port ${port} is already in use. Close the existing process or set PORT in .env.`, error);
      process.exit(1);
    }

    log.error('Server failed to start', error);
    process.exit(1);
  });

  if (envValid) {
    try {
      const db = await initDatabase();
      app.locals.db = db;
      log.info('Database connected and initialized');
    } catch (err) {
      log.error('Database initialization failed - server will continue in degraded mode', err);
      app.locals.db = null;
    }
  } else {
    log.warn('Skipping database init due to missing environment variables - server will continue in degraded mode');
  }

  const shutdown = async () => {
    log.info('Shutdown signal received, closing gracefully...');
    server.close(async () => {
      await closePool();
      log.info('Server stopped');
      process.exit(0);
    });

    setTimeout(() => {
      log.warn('Forced shutdown after timeout');
      process.exit(1);
    }, 5000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
