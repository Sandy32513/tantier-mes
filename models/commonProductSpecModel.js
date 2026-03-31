const createProductConfigModel = require('./createProductConfigModel');

module.exports = createProductConfigModel({
  table: 'common_product_specs',
  entityName: 'Common Product Spec',
  keyField: 'code',
  lifecycleField: 'state',
  requiredFields: ['code', 'description'],
  editableFields: ['description']
});
