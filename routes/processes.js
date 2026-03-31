const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('processes', ['name','code','description','process_type']);
