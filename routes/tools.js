const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('tools', ['tool_group','name','code','description','uom','is_active']);
