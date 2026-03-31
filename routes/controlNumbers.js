const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('control_numbers', ['type', 'format', 'counter', 'alphanumeric_counter']);
