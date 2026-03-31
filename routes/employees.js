const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('employees', ['employee_no', 'first_name', 'middle_name', 'last_name', 'org_role', 'extension']);
