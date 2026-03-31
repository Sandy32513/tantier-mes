const createProductConfigModel = require('./createProductConfigModel');

module.exports = createProductConfigModel({
  table: 'manufacturing_routes',
  entityName: 'Manufacturing Route',
  keyField: 'code',
  lifecycleField: 'status',
  requiredFields: ['code', 'description'],
  editableFields: ['description']
});
