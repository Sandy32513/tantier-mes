const createProductConfigModel = require('./createProductConfigModel');

module.exports = createProductConfigModel({
  table: 'packing_specs',
  entityName: 'Packing Spec',
  keyField: 'code',
  lifecycleField: 'state',
  requiredFields: ['code', 'name'],
  editableFields: ['name', 'dimension', 'is_ng_packing'],
  optionalFields: ['dimension', 'is_ng_packing'],
  fieldTypes: {
    is_ng_packing: 'boolean'
  }
});
