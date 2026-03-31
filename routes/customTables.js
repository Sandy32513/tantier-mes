const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('custom_tables', ['name', 'date_from', 'date_to', 'is_active']);
