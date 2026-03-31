const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('customers', ['name', 'code', 'mother_customer']);
