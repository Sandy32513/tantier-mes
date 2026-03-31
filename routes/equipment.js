const createApiRouter = require('./apiRouter');
module.exports = createApiRouter('equipment', ['equipment_group','name','code','description','serial_no','is_active']);
