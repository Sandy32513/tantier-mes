const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('items', ['item_category', 'item_subcategory', 'item_code', 'description', 'alias', 'item_source', 'uom', 'track_by', 'is_sold', 'has_virtual_bom']);
