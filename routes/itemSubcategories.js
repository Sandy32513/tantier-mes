const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('item_subcategories', ['item_category', 'code', 'description', 'type']);
