const createProductConfigModel = require('./createProductConfigModel');

module.exports = createProductConfigModel({
  table: 'product_specs',
  entityName: 'Product Spec',
  keyField: 'item_code',
  lifecycleField: 'state',
  requiredFields: ['item_code', 'description'],
  editableFields: ['description', 'effectivity_start_date', 'effectivity_end_date'],
  optionalFields: ['effectivity_start_date', 'effectivity_end_date'],
  fieldTypes: {
    effectivity_start_date: 'date',
    effectivity_end_date: 'date'
  }
});
