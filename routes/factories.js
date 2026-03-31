const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('factories', ['name', 'code', 'is_default', 'is_immutable']);
