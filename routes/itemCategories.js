const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('item_categories', ['code', 'description', 'remarks', 'is_immutable']);
