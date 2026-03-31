const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('production_lines', ['factory','name','code','description','is_active']);
