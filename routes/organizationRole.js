const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('organizational_roles', ['org_structure', 'reports_to', 'name', 'code']);
