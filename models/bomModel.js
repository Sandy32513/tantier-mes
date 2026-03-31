const createProductConfigModel = require('./createProductConfigModel');

module.exports = createProductConfigModel({
  table: 'bill_of_materials',
  entityName: 'Bill of Materials',
  keyField: 'item_code',
  lifecycleField: 'state',
  requiredFields: ['item_code', 'description'],
  editableFields: ['description', 'remarks'],
  optionalFields: ['remarks']
});
