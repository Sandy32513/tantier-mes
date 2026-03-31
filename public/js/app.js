(() => {
  const pageKey = document.body.dataset.page;
  const SHORT_PRODUCT_NAME = 'Operon OPS 1.0';
  const FULL_PRODUCT_NAME = 'Operon Operations Platform Suite';
  const PRODUCT_SUBTITLE = 'Smart Factory Operations Platform';
  const PRODUCT_BUILD = 'Build 2026.03';
  const FOOTER_HTML = `
    <span>&copy; 2026 SS Electronics Pvt Ltd</span>
    <span>${FULL_PRODUCT_NAME} (OPS)</span>
    <span>All Rights Reserved</span>
  `;

  /* ── Toast Notifications ─────────────────────────── */
  function ensureToastContainer() {
    let c = document.getElementById('toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  }
  function showToast(msg, type = 'info', duration = 3500) {
    const c = ensureToastContainer();
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    const icons = { success: '✔', error: '✖', info: 'ℹ', warning: '⚠' };
    t.textContent = (icons[type] || '') + '  ' + msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 300ms'; setTimeout(() => t.remove(), 320); }, duration);
  }

  /* ── Module Configs ───────────────────────────────── */
  const yn = [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }];
  const ynAll = [{ value: '', label: '[ All ]' }, ...yn];

  const MODULES = {
    employees: {
      title: 'Employees', breadcrumb: 'Master Data › Employees',
      endpoint: '/api/employees',
      filters: [
        { key: 'employee_no', label: 'Employee No', type: 'text' },
        { key: 'first_name', label: 'First Name', type: 'text' },
        { key: 'middle_name', label: 'Middle Name', type: 'text' },
        { key: 'last_name', label: 'Last Name', type: 'text' },
        { key: 'org_role', label: 'Org Role', type: 'text' },
        { key: 'extension', label: 'Extension', type: 'text' }
      ],
      columns: [
        { key: 'employee_no', label: 'Employee No' }, { key: 'first_name', label: 'First Name' },
        { key: 'middle_name', label: 'Middle Name' }, { key: 'last_name', label: 'Last Name' },
        { key: 'org_role', label: 'Org Role' }, { key: 'extension', label: 'Extension' }
      ],
      formFields: [
        { key: 'employee_no', label: 'Employee No', type: 'text' },
        { key: 'first_name', label: 'First Name', type: 'text' },
        { key: 'middle_name', label: 'Middle Name', type: 'text' },
        { key: 'last_name', label: 'Last Name', type: 'text' },
        { key: 'org_role', label: 'Org Role', type: 'text' },
        { key: 'extension', label: 'Extension', type: 'text' }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'reports']
    },

    systemConfig: {
      title: 'System Configuration', breadcrumb: 'General Setup › System Configuration',
      endpoint: '/api/system-configurations',
      filters: [{ key: 'config_name', label: 'Configuration Name', type: 'text' }],
      columns: [{ key: 'id', label: 'ID' }, { key: 'config_name', label: 'Configuration Name' }],
      formFields: [{ key: 'config_name', label: 'Configuration Name', type: 'text' }],
      buttons: ['search', 'reset', 'edit', 'delete']
    },

    organizationRole: {
      title: 'Organizational Role', breadcrumb: 'General Setup › Organizational Role',
      endpoint: '/api/organizational-roles',
      filters: [
        { key: 'org_structure', label: 'Org Structure', type: 'text' },
        { key: 'reports_to', label: 'Reports To', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' }
      ],
      columns: [
        { key: 'org_structure', label: 'Org Structure' }, { key: 'reports_to', label: 'Reports To' },
        { key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }
      ],
      formFields: [
        { key: 'org_structure', label: 'Org Structure', type: 'text' },
        { key: 'reports_to', label: 'Reports To', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' }
      ],
      buttons: ['search', 'add', 'edit', 'delete', 'view']
    },

    customers: {
      title: 'Customers', breadcrumb: 'Master Data › Customers',
      endpoint: '/api/customers',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'mother_customer', label: 'Mother Customer', type: 'text' }
      ],
      columns: [
        { key: 'name', label: 'Name' }, { key: 'code', label: 'Code' },
        { key: 'mother_customer', label: 'Mother Customer' }
      ],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'mother_customer', label: 'Mother Customer', type: 'text' }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view', 'reports']
    },

    itemCategories: {
      title: 'Item Categories', breadcrumb: 'Master Data › Item Categories',
      endpoint: '/api/item-categories',
      filters: [
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'text' },
        { key: 'is_immutable', label: 'Is Immutable', type: 'select', options: ynAll }
      ],
      columns: [
        { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' },
        { key: 'remarks', label: 'Remarks' }
      ],
      formFields: [
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'text' },
        { key: 'is_immutable', label: 'Is Immutable', type: 'select', options: yn }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    customTables: {
      title: 'Custom Table Setup', breadcrumb: 'General Setup › Custom Table Setup',
      endpoint: '/api/custom-tables',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'date_from', label: 'Date From', type: 'date' },
        { key: 'date_to', label: 'Date To', type: 'date' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: [{ value: '', label: 'All' }, ...yn] }
      ],
      columns: [
        { key: 'name', label: 'Name' }, { key: 'date_from', label: 'Date From' },
        { key: 'date_to', label: 'Date To' },
        { key: 'is_active', label: 'Is Active', format: v => Number(v) === 1 ? 'Yes' : 'No' }
      ],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'date_from', label: 'Date From', type: 'date' },
        { key: 'date_to', label: 'Date To', type: 'date' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: yn }
      ],
      buttons: ['search', 'add', 'edit', 'delete', 'view']
    },

    itemSubcategories: {
      title: 'Item Subcategories', breadcrumb: 'Master Data › Item Subcategories',
      endpoint: '/api/item-subcategories',
      filters: [
        { key: 'item_category', label: 'Item Category', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'type', label: 'Type', type: 'select', options: [{ value: '', label: '[ All ]' }, { value: 'Inventory', label: 'Inventory' }, { value: 'Asset', label: 'Asset' }] }
      ],
      columns: [
        { key: 'item_category', label: 'Item Category' }, { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' }, { key: 'type', label: 'Type' }
      ],
      formFields: [
        { key: 'item_category', label: 'Item Category', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'type', label: 'Type', type: 'select', options: [{ value: 'Inventory', label: 'Inventory' }, { value: 'Asset', label: 'Asset' }] }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view', 'reports']
    },

    itemMaster: {
      title: 'Item Master', breadcrumb: 'Master Data › Item Master',
      endpoint: '/api/items',
      filters: [
        { key: 'item_category', label: 'Item Category', type: 'text' },
        { key: 'item_subcategory', label: 'Item Subcategory', type: 'text' },
        { key: 'item_code', label: 'Item Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'alias', label: 'Alias', type: 'text' },
        { key: 'item_source', label: 'Item Source', type: 'text' },
        { key: 'uom', label: 'UOM', type: 'text' },
        { key: 'track_by', label: 'Track By', type: 'text' },
        { key: 'is_sold', label: 'Is Sold', type: 'select', options: ynAll },
        { key: 'has_virtual_bom', label: 'Has Virtual BOM', type: 'select', options: ynAll }
      ],
      columns: [
        { key: 'item_category', label: 'Item Category' }, { key: 'item_subcategory', label: 'Item Subcategory' },
        { key: 'item_code', label: 'Item Code' }, { key: 'description', label: 'Description' },
        { key: 'alias', label: 'Alias' }, { key: 'item_source', label: 'Item Source' },
        { key: 'uom', label: 'UOM' }, { key: 'track_by', label: 'Track By' }
      ],
      formFields: [
        { key: 'item_category', label: 'Item Category', type: 'text' },
        { key: 'item_subcategory', label: 'Item Subcategory', type: 'text' },
        { key: 'item_code', label: 'Item Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'alias', label: 'Alias', type: 'text' },
        { key: 'item_source', label: 'Item Source', type: 'text' },
        { key: 'uom', label: 'UOM', type: 'text' },
        { key: 'track_by', label: 'Track By', type: 'text' },
        { key: 'is_sold', label: 'Is Sold', type: 'select', options: yn },
        { key: 'has_virtual_bom', label: 'Has Virtual BOM', type: 'select', options: yn }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'copy', 'delete', 'view', 'reports']
    },

    factories: {
      title: 'Factories', breadcrumb: 'Factory Setup › Factories',
      endpoint: '/api/factories',
      filters: [
        { key: 'name', label: 'Name', type: 'text' }, { key: 'code', label: 'Code', type: 'text' },
        { key: 'is_default', label: 'Is Default', type: 'select', options: ynAll },
        { key: 'is_immutable', label: 'Is Immutable', type: 'select', options: ynAll }
      ],
      columns: [{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' }, { key: 'code', label: 'Code', type: 'text' },
        { key: 'is_default', label: 'Is Default', type: 'select', options: yn },
        { key: 'is_immutable', label: 'Is Immutable', type: 'select', options: yn }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    shifts: {
      title: 'Shifts', breadcrumb: 'Factory Setup › Shifts',
      endpoint: '/api/shifts',
      filters: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'code', label: 'Code', type: 'text' }],
      columns: [{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }],
      formFields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'code', label: 'Code', type: 'text' }],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    controlNumbers: {
      title: 'Control Number Setup', breadcrumb: 'General Setup › Control Number Setup',
      endpoint: '/api/control-numbers',
      filters: [
        { key: 'type', label: 'Type', type: 'text' }, { key: 'format', label: 'Format', type: 'text' },
        { key: 'alphanumeric_counter', label: 'Alphanumeric Counter', type: 'text' }
      ],
      columns: [
        { key: 'type', label: 'Type' }, { key: 'format', label: 'Format' },
        { key: 'counter', label: 'Counter' }, { key: 'alphanumeric_counter', label: 'Alphanumeric Counter' }
      ],
      formFields: [
        { key: 'type', label: 'Type', type: 'text' }, { key: 'format', label: 'Format', type: 'text' },
        { key: 'counter', label: 'Counter', type: 'number' },
        { key: 'alphanumeric_counter', label: 'Alphanumeric Counter', type: 'text' }
      ],
      buttons: ['search', 'edit', 'delete']
    },

    /* ── New Factory Setup Modules ─────────────────── */
    skills: {
      title: 'Skills', breadcrumb: 'Factory Setup › Skills',
      endpoint: '/api/skills',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      columns: [{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' }],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    skillsets: {
      title: 'Skillsets', breadcrumb: 'Factory Setup › Skillsets',
      endpoint: '/api/skillsets',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      columns: [{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' }],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    toolGroups: {
      title: 'Tool Groups', breadcrumb: 'Factory Setup › Tool Groups',
      endpoint: '/api/tool-groups',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      columns: [{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' }],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    tools: {
      title: 'Tools', breadcrumb: 'Factory Setup › Tools',
      endpoint: '/api/tools',
      filters: [
        { key: 'tool_group', label: 'Tool Group', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'uom', label: 'UOM', type: 'text' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: ynAll }
      ],
      columns: [
        { key: 'tool_group', label: 'Tool Group' }, { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' },
        { key: 'uom', label: 'UOM' },
        { key: 'is_active', label: 'Is Active', format: v => Number(v) === 1 ? 'Yes' : 'No' }
      ],
      formFields: [
        { key: 'tool_group', label: 'Tool Group', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'uom', label: 'UOM', type: 'text' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: yn }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    equipmentGroups: {
      title: 'Equipment Groups', breadcrumb: 'Factory Setup › Equipment Groups',
      endpoint: '/api/equipment-groups',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      columns: [{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' }],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    equipment: {
      title: 'Equipment', breadcrumb: 'Factory Setup › Equipment',
      endpoint: '/api/equipment',
      filters: [
        { key: 'equipment_group', label: 'Equipment Group', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'serial_no', label: 'Serial No', type: 'text' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: ynAll }
      ],
      columns: [
        { key: 'equipment_group', label: 'Equipment Group' }, { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' },
        { key: 'serial_no', label: 'Serial No' },
        { key: 'is_active', label: 'Is Active', format: v => Number(v) === 1 ? 'Yes' : 'No' }
      ],
      formFields: [
        { key: 'equipment_group', label: 'Equipment Group', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'serial_no', label: 'Serial No', type: 'text' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: yn }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    processes: {
      title: 'Processes', breadcrumb: 'Factory Setup › Processes',
      endpoint: '/api/processes',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'process_type', label: 'Process Type', type: 'text' }
      ],
      columns: [
        { key: 'name', label: 'Name' }, { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' }, { key: 'process_type', label: 'Process Type' }
      ],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'process_type', label: 'Process Type', type: 'text' }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    productionLines: {
      title: 'Production Lines', breadcrumb: 'Factory Setup › Production Lines',
      endpoint: '/api/production-lines',
      filters: [
        { key: 'factory', label: 'Factory', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: ynAll }
      ],
      columns: [
        { key: 'factory', label: 'Factory' }, { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' },
        { key: 'is_active', label: 'Is Active', format: v => Number(v) === 1 ? 'Yes' : 'No' }
      ],
      formFields: [
        { key: 'factory', label: 'Factory', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'is_active', label: 'Is Active', type: 'select', options: yn }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    jobOrders: {
      title: 'Job Orders',
      breadcrumb: 'Work In Process > WIP Transactions > Job Orders',
      endpoint: null,
      filters: [
        { key: 'job_order_no', label: 'Job Order Number', type: 'text' },
        { key: 'manufactured_item', label: 'Manufactured Item', type: 'text' },
        { key: 'item_subcategory', label: 'Item Subcategory', type: 'text' },
        { key: 'production_line', label: 'Production Line', type: 'text' },
        { key: 'batch_number', label: 'Batch Number', type: 'text' },
        { key: 'revision_name', label: 'Revision Name', type: 'text' },
        { key: 'priority', label: 'Priority', type: 'text' },
        { key: 'status', label: 'Status', type: 'text' },
        { key: 'planned_start_date', label: 'Planned Start Date', type: 'date' },
        { key: 'planned_completion_date', label: 'Planned Completion Date', type: 'date' },
        { key: 'actual_start_date', label: 'Actual Start Date', type: 'date' },
        { key: 'actual_completion_date', label: 'Actual Completion Date', type: 'date' },
        { key: 'issuance_status', label: 'Issuance Status', type: 'text' }
      ],
      columns: [
        { key: 'job_order_no', label: 'Job Order' },
        { key: 'manufactured_item', label: 'Manufactured Item' },
        { key: 'revision_name', label: 'Revision' },
        { key: 'production_line', label: 'Production Line' },
        { key: 'status', label: 'Status' },
        { key: 'planned_start_date', label: 'Planned Start', format: formatDateTimeCell },
        { key: 'actual_start_date', label: 'Actual Start', format: formatDateTimeCell },
        { key: 'planned_completion_date', label: 'Planned Completion', format: formatDateTimeCell }
      ],
      staticRows: [
        {
          id: 1,
          job_order_no: '8929',
          manufactured_item: '1600002258 | MCH_NE',
          item_subcategory: 'SFG',
          production_line: 'A2AN',
          batch_number: 'BM-001',
          revision_name: 'Revision 2',
          priority: 'Normal',
          status: 'Released',
          planned_start_date: '2026-03-11',
          planned_completion_date: '2026-03-14',
          actual_start_date: '2026-03-11',
          actual_completion_date: '',
          issuance_status: 'Issued'
        },
        {
          id: 2,
          job_order_no: '8928',
          manufactured_item: '1600002252 | EXTRUSION',
          item_subcategory: 'SFG',
          production_line: 'B3C2',
          batch_number: 'BM-002',
          revision_name: 'Revision 1',
          priority: 'High',
          status: 'WIP',
          planned_start_date: '2026-03-11',
          planned_completion_date: '2026-03-13',
          actual_start_date: '2026-03-11',
          actual_completion_date: '',
          issuance_status: 'Issued'
        },
        {
          id: 3,
          job_order_no: '8926',
          manufactured_item: '1600002250 | EXTRUSION',
          item_subcategory: 'SFG',
          production_line: 'B3C1',
          batch_number: 'BM-003',
          revision_name: 'Revision 0',
          priority: 'Normal',
          status: 'WIP',
          planned_start_date: '2026-03-10',
          planned_completion_date: '2026-03-12',
          actual_start_date: '2026-03-10',
          actual_completion_date: '',
          issuance_status: 'Pending'
        }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    lotList: {
      title: 'Lot List',
      breadcrumb: 'Work In Process > WIP Transactions > Lot List',
      endpoint: null,
      filters: [
        { key: 'job_order_no', label: 'Job Order Number', type: 'text' },
        { key: 'item', label: 'Item', type: 'text' },
        { key: 'lot_number', label: 'Lot Number', type: 'text' },
        { key: 'current_process', label: 'Current Process', type: 'text' },
        { key: 'group_code', label: 'Group Code', type: 'text' },
        { key: 'inventory_status', label: 'Inventory Status', type: 'text' },
        { key: 'status', label: 'Status', type: 'text' },
        { key: 'production_line', label: 'Production Line', type: 'text' },
        { key: 'planned_completion_date', label: 'Planned Completion Date', type: 'date' }
      ],
      columns: [
        { key: 'job_order_no', label: 'Job Order' },
        { key: 'lot_number', label: 'Lot Number' },
        { key: 'item', label: 'Item' },
        { key: 'current_process', label: 'Current Process' },
        { key: 'group_code', label: 'Group Code' },
        { key: 'status', label: 'Status' },
        { key: 'production_line', label: 'Production Line' },
        { key: 'planned_completion_date', label: 'Planned Completion', format: formatDateTimeCell }
      ],
      staticRows: [
        {
          id: 1,
          job_order_no: '8851',
          lot_number: 'HNFHRL001Z',
          item: '1600002277',
          current_process: '20-BM-QC-10',
          group_code: 'QC-1',
          inventory_status: 'None',
          status: 'WIP',
          production_line: 'B3L1',
          planned_completion_date: '2026-03-12'
        },
        {
          id: 2,
          job_order_no: '8896',
          lot_number: 'HWXHP350M',
          item: '1600002253',
          current_process: '20-BM-CN-12',
          group_code: 'QC-2',
          inventory_status: 'None',
          status: 'WIP',
          production_line: 'B3L2',
          planned_completion_date: '2026-03-14'
        },
        {
          id: 3,
          job_order_no: '8908',
          lot_number: 'HWXHP1YWG',
          item: '1600002257',
          current_process: '20-BM-CN-12',
          group_code: 'QC-3',
          inventory_status: 'None',
          status: 'WIP',
          production_line: 'B3L4',
          planned_completion_date: '2026-03-15'
        }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    moveLot: {
      title: 'Move Lot',
      breadcrumb: 'Work In Process > WIP Transactions > Move Lot',
      endpoint: null,
      filters: [
        { key: 'job_order_no', label: 'Job Order Number', type: 'text' },
        { key: 'item', label: 'Item', type: 'text' },
        { key: 'lot_code', label: 'Lot Code', type: 'text' },
        { key: 'current_process', label: 'Current Process', type: 'text' },
        { key: 'next_process', label: 'Next Process', type: 'text' },
        { key: 'priority', label: 'Priority', type: 'text' },
        { key: 'status', label: 'Status', type: 'text' },
        { key: 'planned_completion_date', label: 'Planned Completion Date', type: 'date' }
      ],
      columns: [
        { key: 'job_order_no', label: 'Job Order' },
        { key: 'lot_code', label: 'Lot Code' },
        { key: 'item', label: 'Item' },
        { key: 'current_process', label: 'Current Process' },
        { key: 'next_process', label: 'Next Process' },
        { key: 'status', label: 'Status' },
        { key: 'planned_completion_date', label: 'Planned Completion', format: formatDateTimeCell }
      ],
      staticRows: [
        {
          id: 1,
          job_order_no: '588',
          lot_code: 'HWXH81YQCA1',
          item: '1600001742',
          current_process: '10-ANO-QS-04',
          next_process: '20-BM-QC-10',
          priority: '1',
          status: 'In Process',
          planned_completion_date: '2026-03-10'
        },
        {
          id: 2,
          job_order_no: '632',
          lot_code: 'HWXH8DYW3PC',
          item: '1600001743',
          current_process: '10-ANO-QS-04',
          next_process: '20-BM-QC-10',
          priority: '1',
          status: 'In Process',
          planned_completion_date: '2026-03-12'
        },
        {
          id: 3,
          job_order_no: '676',
          lot_code: 'HWXH6F30PWA',
          item: '1600001739',
          current_process: '10-ANO-QS-04',
          next_process: '20-BM-QC-10',
          priority: '1',
          status: 'In Process',
          planned_completion_date: '2026-03-13'
        }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    },

    shopfloorConsole: {
      title: 'Shopfloor Console',
      breadcrumb: 'Work In Process > WIP Transactions > Shopfloor Console',
      endpoint: null,
      filters: [
        { key: 'equipment', label: 'Equipment', type: 'text' }
      ],
      columns: [
        { key: 'equipment', label: 'Equipment' },
        { key: 'sample_to_be_picked', label: 'Sample to be Picked' },
        { key: 'sample_picked', label: 'Sample Picked' },
        { key: 'inspection_completed', label: 'Inspection Completed' },
        { key: 'return_to_production', label: 'Return to Production' },
        { key: 'ok_quantity', label: 'OK Quantity' },
        { key: 'not_ok_quantity', label: 'Not OK Quantity' },
        { key: 'scrap', label: 'Scrap' },
        { key: 'rework', label: 'Rework' }
      ],
      staticRows: [
        {
          id: 1,
          equipment: 'ASOQCPAK_01',
          sample_to_be_picked: 1,
          sample_picked: 0,
          inspection_completed: 0,
          return_to_production: 0,
          ok_quantity: 0,
          not_ok_quantity: 0,
          scrap: 0,
          rework: 0
        },
        {
          id: 2,
          equipment: 'B1LC1-1BUF01',
          sample_to_be_picked: 1,
          sample_picked: 0,
          inspection_completed: 0,
          return_to_production: 0,
          ok_quantity: 0,
          not_ok_quantity: 0,
          scrap: 0,
          rework: 0
        },
        {
          id: 3,
          equipment: 'B1LC1-1BUF03',
          sample_to_be_picked: 1,
          sample_picked: 0,
          inspection_completed: 0,
          return_to_production: 0,
          ok_quantity: 0,
          not_ok_quantity: 0,
          scrap: 0,
          rework: 0
        }
      ],
      buttons: ['search', 'reset', 'add', 'edit', 'delete', 'view']
    }
  };

  /* ── Sidebar Config ───────────────────────────────── */
  function toDateOnly(value) {
    if (!value) return '';
    const text = String(value);
    return text.length >= 10 ? text.slice(0, 10) : text;
  }

  const UPLOAD_MODULES = {
    toolGroupUpload: {
      title: 'Tool Group Upload',
      breadcrumb: 'Factory Setup &rsaquo; Factory Uploads &rsaquo; Tool Group Upload',
      uploadEndpoint: '/api/upload/tool-group',
      viewEndpoint: '/api/tool-groups',
      dataColumns: [
        { key: 'item_subcategory', label: 'Item Subcategory' },
        { key: 'tool_group_item_code', label: 'Tool Group Item Code' },
        { key: 'track_by', label: 'Track By' },
        { key: 'tool_life', label: 'Tool Life' },
        { key: 'calibration_trigger', label: 'Calibration Trigger' },
        { key: 'tool_group_description', label: 'Tool Group Description' }
      ],
      mapViewRow(row, index) {
        return {
          rowNumber: index + 1,
          values: {
            item_subcategory: row.item_subcategory ?? '',
            tool_group_item_code: row.tool_group_item_code ?? row.code ?? '',
            track_by: row.track_by ?? '',
            tool_life: row.tool_life ?? '',
            calibration_trigger: row.calibration_trigger ?? '',
            tool_group_description: row.tool_group_description ?? row.description ?? ''
          },
          errors: []
        };
      }
    },
    toolUpload: {
      title: 'Tool Upload',
      breadcrumb: 'Factory Setup &rsaquo; Factory Uploads &rsaquo; Tool Upload',
      uploadEndpoint: '/api/upload/tool',
      viewEndpoint: '/api/tools',
      dataColumns: [
        { key: 'tool_group', label: 'Tool Group' },
        { key: 'tracking_number', label: 'Tracking Number' },
        { key: 'date_acquired', label: 'Date Acquired' },
        { key: 'last_calibration_date', label: 'Last Calibration Date' },
        { key: 'remaining_tool_life', label: 'Remaining Tool Life' }
      ],
      mapViewRow(row, index) {
        return {
          rowNumber: index + 1,
          values: {
            tool_group: row.tool_group ?? '',
            tracking_number: row.tracking_number ?? row.code ?? row.serial_no ?? '',
            date_acquired: toDateOnly(row.date_acquired),
            last_calibration_date: toDateOnly(row.last_calibration_date),
            remaining_tool_life: row.remaining_tool_life ?? ''
          },
          errors: []
        };
      }
    },
    equipmentGroupUpload: {
      title: 'Equipment Group Upload',
      breadcrumb: 'Factory Setup &rsaquo; Factory Uploads &rsaquo; Equipment Group Upload',
      uploadEndpoint: '/api/upload/equipment-group',
      viewEndpoint: '/api/equipment-groups',
      dataColumns: [
        { key: 'item_subcategory', label: 'Item Subcategory' },
        { key: 'equipment_group_code', label: 'Equipment Group Code' },
        { key: 'equipment_group_description', label: 'Equipment Group Description' },
        { key: 'setup_time', label: 'Setup Time' },
        { key: 'cost_per_hour', label: 'Cost Per Hour' }
      ],
      mapViewRow(row, index) {
        return {
          rowNumber: index + 1,
          values: {
            item_subcategory: row.item_subcategory ?? '',
            equipment_group_code: row.equipment_group_code ?? row.code ?? '',
            equipment_group_description: row.equipment_group_description ?? row.description ?? '',
            setup_time: row.setup_time ?? '',
            cost_per_hour: row.cost_per_hour ?? ''
          },
          errors: []
        };
      }
    },
    equipmentUpload: {
      title: 'Equipment Upload',
      breadcrumb: 'Factory Setup &rsaquo; Factory Uploads &rsaquo; Equipment Upload',
      uploadEndpoint: '/api/upload/equipment',
      viewEndpoint: '/api/equipment',
      dataColumns: [
        { key: 'equipment_group', label: 'Equipment Group' },
        { key: 'tracking_number', label: 'Tracking Number' },
        { key: 'production_line', label: 'Production Line' },
        { key: 'efficiency_percentage', label: 'Efficiency (%)' },
        { key: 'effectivity_date', label: 'Effectivity Date' },
        { key: 'maximum_component_limit', label: 'Maximum Component Limit' }
      ],
      mapViewRow(row, index) {
        return {
          rowNumber: index + 1,
          values: {
            equipment_group: row.equipment_group ?? '',
            tracking_number: row.tracking_number ?? row.serial_no ?? row.code ?? '',
            production_line: row.production_line ?? '',
            efficiency_percentage: row.efficiency_percentage ?? '',
            effectivity_date: toDateOnly(row.effectivity_date),
            maximum_component_limit: row.maximum_component_limit ?? ''
          },
          errors: []
        };
      }
    }
  };

  const revisionStateOptions = [
    { value: '', label: '[ All ]' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Released', label: 'Released' },
    { value: 'Active', label: 'Active' },
    { value: 'Archived', label: 'Archived' }
  ];
  const noYes = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];

  const PRODUCT_CONFIG_MODULES = {
    manufacturingRoute: {
      title: 'Manufacturing Route',
      breadcrumb: 'Product Configuration &rsaquo; Manufacturing Route',
      endpoint: '/api/manufacturing-routes',
      lifecycleField: 'status',
      filters: [
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'revision_name', label: 'Revision Name', type: 'text' },
        { key: 'display_state', label: 'Status', type: 'select', options: revisionStateOptions },
        { key: 'is_default', label: 'Default', type: 'select', options: ynAll }
      ],
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name', sortKey: 'revision_number', format: row => formatRevisionCell(row) },
        { key: 'display_state', label: 'Status', format: row => formatLifecycleCell(row.display_state) }
      ],
      formFields: [
        { key: 'code', label: 'Code', type: 'text', readOnlyOnEdit: true },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      viewFields: [
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'Status' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      exportColumns: [
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'Status' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      actions: ['add', 'edit', 'copy', 'view', 'release', 'activate', 'archive', 'export']
    },
    billOfMaterials: {
      title: 'Bill of Materials',
      breadcrumb: 'Product Configuration &rsaquo; Bill of Materials',
      endpoint: '/api/bill-of-materials',
      lifecycleField: 'state',
      filters: [
        { key: 'item_code', label: 'Item Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'revision_name', label: 'Revision Name', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'text' },
        { key: 'display_state', label: 'State', type: 'select', options: revisionStateOptions }
      ],
      columns: [
        { key: 'item_code', label: 'Item Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name', sortKey: 'revision_number', format: row => formatRevisionCell(row) },
        { key: 'remarks', label: 'Remarks' },
        { key: 'display_state', label: 'State', format: row => formatLifecycleCell(row.display_state) }
      ],
      formFields: [
        { key: 'item_code', label: 'Item Code', type: 'text', readOnlyOnEdit: true },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'text' }
      ],
      viewFields: [
        { key: 'item_code', label: 'Item Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'remarks', label: 'Remarks' },
        { key: 'display_state', label: 'State' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      exportColumns: [
        { key: 'item_code', label: 'Item Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'remarks', label: 'Remarks' },
        { key: 'display_state', label: 'State' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      actions: ['add', 'edit', 'copy', 'view', 'release', 'activate', 'archive', 'export']
    },
    productSpec: {
      title: 'Product Spec',
      breadcrumb: 'Product Configuration &rsaquo; Product Spec',
      endpoint: '/api/product-spec',
      lifecycleField: 'state',
      filters: [
        { key: 'item_code', label: 'Item', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'revision_name', label: 'Revision Name', type: 'text' },
        { key: 'display_state', label: 'State', type: 'select', options: revisionStateOptions },
        { key: 'effectivity_start_date', label: 'Effectivity Start Date', type: 'date' },
        { key: 'effectivity_end_date', label: 'Effectivity End Date', type: 'date' }
      ],
      columns: [
        { key: 'item_code', label: 'Item' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name', sortKey: 'revision_number', format: row => formatRevisionCell(row) },
        { key: 'display_state', label: 'State', format: row => formatLifecycleCell(row.display_state) },
        { key: 'effectivity_start_date', label: 'Effectivity Start Date', format: row => escapeHtml(formatDateTimeCell(row.effectivity_start_date)) },
        { key: 'effectivity_end_date', label: 'Effectivity End Date', format: row => escapeHtml(formatDateTimeCell(row.effectivity_end_date)) }
      ],
      formFields: [
        { key: 'item_code', label: 'Item', type: 'text', readOnlyOnEdit: true },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'effectivity_start_date', label: 'Effectivity Start Date', type: 'date' },
        { key: 'effectivity_end_date', label: 'Effectivity End Date', type: 'date' }
      ],
      viewFields: [
        { key: 'item_code', label: 'Item' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'State' },
        { key: 'effectivity_start_date', label: 'Effectivity Start Date', format: row => formatDateTimeCell(row.effectivity_start_date) },
        { key: 'effectivity_end_date', label: 'Effectivity End Date', format: row => formatDateTimeCell(row.effectivity_end_date) },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      exportColumns: [
        { key: 'item_code', label: 'Item' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'State' },
        { key: 'effectivity_start_date', label: 'Effectivity Start Date', format: row => formatDateTimeCell(row.effectivity_start_date) },
        { key: 'effectivity_end_date', label: 'Effectivity End Date', format: row => formatDateTimeCell(row.effectivity_end_date) },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      actions: ['add', 'edit', 'copy', 'view', 'release', 'activate', 'archive', 'export']
    },
    commonProductSpec: {
      title: 'Common Product Spec',
      breadcrumb: 'Product Configuration &rsaquo; Common Product Spec',
      endpoint: '/api/common-product-spec',
      lifecycleField: 'state',
      filters: [
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'revision_name', label: 'Revision Name', type: 'text' },
        { key: 'display_state', label: 'State', type: 'select', options: revisionStateOptions }
      ],
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name', sortKey: 'revision_number', format: row => formatRevisionCell(row) },
        { key: 'display_state', label: 'State', format: row => formatLifecycleCell(row.display_state) }
      ],
      formFields: [
        { key: 'code', label: 'Code', type: 'text', readOnlyOnEdit: true },
        { key: 'description', label: 'Description', type: 'text' }
      ],
      viewFields: [
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'State' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      exportColumns: [
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'State' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      actions: ['add', 'edit', 'copy', 'view', 'release', 'activate', 'archive', 'export']
    },
    packingSpec: {
      title: 'Packing Spec',
      breadcrumb: 'Product Configuration &rsaquo; Packing Spec',
      endpoint: '/api/packing-spec',
      lifecycleField: 'state',
      filters: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'dimension', label: 'Dimension', type: 'text' },
        { key: 'is_ng_packing', label: 'Is NG Packing', type: 'select', options: ynAll },
        { key: 'revision_name', label: 'Revision Name', type: 'text' },
        { key: 'display_state', label: 'State', type: 'select', options: revisionStateOptions }
      ],
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'dimension', label: 'Dimension' },
        { key: 'is_ng_packing', label: 'Is NG Packing', format: row => escapeHtml(Number(row.is_ng_packing) === 1 ? 'Yes' : 'No') },
        { key: 'revision_name', label: 'Revision Name', sortKey: 'revision_number', format: row => formatRevisionCell(row) },
        { key: 'display_state', label: 'State', format: row => formatLifecycleCell(row.display_state) }
      ],
      formFields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'code', label: 'Code', type: 'text', readOnlyOnEdit: true },
        { key: 'dimension', label: 'Dimension', type: 'text' },
        { key: 'is_ng_packing', label: 'Is NG Packing', type: 'select', options: noYes }
      ],
      viewFields: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'dimension', label: 'Dimension' },
        { key: 'is_ng_packing', label: 'Is NG Packing', format: row => Number(row.is_ng_packing) === 1 ? 'Yes' : 'No' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'State' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      exportColumns: [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'dimension', label: 'Dimension' },
        { key: 'is_ng_packing', label: 'Is NG Packing', format: row => Number(row.is_ng_packing) === 1 ? 'Yes' : 'No' },
        { key: 'revision_name', label: 'Revision Name' },
        { key: 'display_state', label: 'State' },
        { key: 'is_default', label: 'Active', format: row => Number(row.is_default) === 1 ? 'Yes' : 'No' },
        { key: 'created_date', label: 'Created Date', format: row => formatDateTimeCell(row.created_date) }
      ],
      actions: ['add', 'edit', 'copy', 'view', 'release', 'activate', 'archive', 'export']
    }
  };

  const sidebar = [
    {
      title: 'General Setup', open: true,
      items: [
        { label: 'System Configuration', href: '/system-configuration', key: 'systemConfig' },
        { label: 'Organizational Role',  href: '/organizational-role',  key: 'organizationRole' },
        { label: 'Custom Table Setup',   href: '/custom-tables',        key: 'customTables' },
        { label: 'Control Number Setup', href: '/control-numbers',      key: 'controlNumbers' }
      ]
    },
    {
      title: 'Master Data', open: true,
      items: [
        { label: 'Employees',         href: '/employees',         key: 'employees' },
        { label: 'Customers',         href: '/customers',         key: 'customers' },
        { label: 'Item Categories',   href: '/item-categories',   key: 'itemCategories' },
        { label: 'Item Subcategories',href: '/item-subcategories',key: 'itemSubcategories' },
        { label: 'Item Master',       href: '/item-master',       key: 'itemMaster' }
      ]
    },
    {
      title: 'Factory Setup', open: false,
      items: [
        { label: 'Factories',         href: '/factories',          key: 'factories' },
        { label: 'Shifts',            href: '/shifts',             key: 'shifts' },
        { label: 'Skills',            href: '/skills',             key: 'skills' },
        { label: 'Skillsets',         href: '/skillsets',          key: 'skillsets' },
        { label: 'Tool Groups',       href: '/tool-groups',        key: 'toolGroups' },
        { label: 'Tools',             href: '/tools',              key: 'tools' },
        { label: 'Equipment Groups',  href: '/equipment-groups',   key: 'equipmentGroups' },
        { label: 'Equipment',         href: '/equipment',          key: 'equipment' },
        { label: 'Processes',         href: '/processes',          key: 'processes' },
        { label: 'Production Lines',  href: '/production-lines',   key: 'productionLines' }
      ]
    },
    {
      title: 'Factory Uploads', open: false,
      items: [
        { label: 'Tool Group Upload',      href: '/factory-uploads/tool-group',      key: 'toolGroupUpload' },
        { label: 'Tool Upload',            href: '/factory-uploads/tool',            key: 'toolUpload' },
        { label: 'Equipment Group Upload', href: '/factory-uploads/equipment-group', key: 'equipmentGroupUpload' },
        { label: 'Equipment Upload',       href: '/factory-uploads/equipment',       key: 'equipmentUpload' }
      ]
    },
    {
      title: 'Product Configuration', open: false,
      items: [
        { label: 'Manufacturing Route', href: '/manufacturing-route', key: 'manufacturingRoute' },
        { label: 'Bill of Materials',   href: '/bill-of-materials',  key: 'billOfMaterials' },
        { label: 'Product Spec',        href: '/product-spec',       key: 'productSpec' },
        { label: 'Common Product Spec', href: '/common-product-spec',key: 'commonProductSpec' },
        { label: 'Packing Spec',        href: '/packing-spec',       key: 'packingSpec' }
      ]
    },
    { title: 'Uploads',              open: false, items: ['Bill Of Materials Upload', 'Configuration Reports'] },
    { title: 'Inventory Management', open: false, items: ['Inventory Setup', 'Locations', 'Item Routing Categories'] },
    { title: 'Inventory Transactions',open: false, items: ['Issuance Request', 'Approval', 'Other Issuances', 'Stock Transfers'] },
    { title: 'Inventory Monitoring', open: false, items: ['Tracked Item List', 'Items in Location'] },
    {
      title: 'Work-In-Process', open: false,
      items: [
        'WIP Setup','Defects','Defect Groups','Defect Upload','Lot Adjustment Reasons','Hold Codes','Rework Reasons',
        'Operators','Operator Upload','FG Unpack Reasons','Block Access','WIP Transactions',
        { label: 'Job Orders', href: '/job-orders', key: 'jobOrders' },
        'Job Order Upload',
        { label: 'Lot List', href: '/lot-list', key: 'lotList' },
        { label: 'Move Lot', href: '/move-lot', key: 'moveLot' },
        { label: 'Shopfloor Console', href: '/shopfloor-console', key: 'shopfloorConsole' },
        'WIP Reports'
      ]
    },
    {
      title: 'Quality Management', open: false,
      items: ['SPC','SPC Setup','SPC Transactions','Data Visualization','SPC Reports','DCC','DCC Setup','DCC Transactions','DCC Reports','NCM','NCM Setup','NCM Transaction','NCM Reports']
    },
    { title: 'IIoT',  open: false, items: ['Plant','Block','Line','Cell','Machine','Machine Detail','Process Parameter','OEE Report','Alarms','Real Time','History','Analysis','Diagnosis'] },
    { title: 'CMMS',  open: false, items: ['CMMS Setup','CMMS Transactions','CMMS Monitoring','CMMS Planning','CMMS Reports'] },
    { title: 'Integration Manager', open: false, items: ['ERP','IIoT','Ignition','API Event Viewer'] },
    { title: 'Security', open: false, items: ['Roles','User Accounts','User Account Upload','Change Password','Audit Trails','Security Reports','User Security Details'] }
  ];

  const dashboardModules = ['WIP','SPC','DCC','IIoT','CMMS','RMS','OEE','Inventory','Planning','Execution'];

  /* ── Shell Template ───────────────────────────────── */
  function shell(content) {
    return `
      <div class="app-shell">
        <header class="topbar">
          <div class="topbar-home" onclick="location.href='/dashboard'" title="Home">&#8962;</div>
          <div class="topbar-brand">
            <div class="topbar-title">${SHORT_PRODUCT_NAME}</div>
            <div class="topbar-subtitle">${PRODUCT_SUBTITLE}</div>
          </div>
          <div class="topbar-right">
            <div class="topbar-chip topbar-build">${PRODUCT_BUILD}</div>
            <div class="topbar-chip topbar-user">
              <span class="topbar-avatar">S</span>
              <span class="topbar-user-meta">
                <span class="topbar-user-name">K. Santhosh</span>
                <span class="topbar-user-role">Key-user</span>
              </span>
            </div>
            <div class="topbar-chip">SS Electronics Pvt Ltd</div>
            <button class="topbar-chip logout" id="logout-btn" type="button" title="Logout">&#10162;</button>
          </div>
        </header>
        <aside class="sidebar">
          <div class="sidebar-toggle" id="sidebar-toggle">&#9776;</div>
          <div class="sidebar-inner" id="sidebar-inner">
            <input class="sidebar-search" id="sidebar-search" placeholder="Search in menu&hellip;" />
            <div id="sidebar-menu"></div>
          </div>
        </aside>
        <main class="content-area">${content}</main>
        <footer class="footer-fixed">${FOOTER_HTML}</footer>
      </div>`;
  }

  function shopfloorShell(content) {
    return `
      <div class="sf-shell">
        <header class="topbar sf-topbar">
          <div class="topbar-home" onclick="location.href='/dashboard'" title="Home">&#8962;</div>
          <div class="topbar-brand">
            <div class="topbar-title">${SHORT_PRODUCT_NAME}</div>
            <div class="topbar-subtitle">${PRODUCT_SUBTITLE}</div>
          </div>
          <div class="topbar-right">
            <div class="topbar-chip topbar-build">${PRODUCT_BUILD}</div>
            <div class="topbar-chip topbar-user">
              <span class="topbar-avatar">S</span>
              <span class="topbar-user-meta">
                <span class="topbar-user-name">K. Santhosh</span>
                <span class="topbar-user-role">Key-user</span>
              </span>
            </div>
            <div class="topbar-chip">SS Electronics Pvt Ltd</div>
            <button class="topbar-chip logout" id="logout-btn" type="button" title="Logout">&#10162;</button>
          </div>
        </header>
        <div class="sf-body">
          <aside class="sf-mini-sidebar">
            <div class="sf-mini-toggle" title="Menu">&#9776;</div>
            <div class="sf-mini-item active">Quality Management</div>
            <div class="sf-mini-item sf-mini-sub active">Quality Control</div>
          </aside>
          <main class="sf-content">${content}</main>
        </div>
        <footer class="footer-fixed">${FOOTER_HTML}</footer>
      </div>`;
  }

  /* ── Sidebar Rendering ────────────────────────────── */
  function sidebarItem(item) {
    if (typeof item === 'string') {
      return `<span class="menu-item muted" data-label="${item.toLowerCase()}">${item}</span>`;
    }
    const active = item.key === pageKey ? 'active' : '';
    return `<a class="menu-item ${active}" href="${item.href}" data-label="${item.label.toLowerCase()}">${item.label}</a>`;
  }

  function renderSidebar() {
    // Auto-open the group that contains the active page
    sidebar.forEach(group => {
      if (group.items.some(i => typeof i === 'object' && i.key === pageKey)) group.open = true;
    });

    const root = document.getElementById('sidebar-menu');
    root.innerHTML = sidebar.map((group, idx) => `
      <div class="menu-group">
        <div class="menu-group-header" data-head="${idx}">
          <span class="menu-caret ${group.open ? 'open' : ''}">&#9658;</span>
          <span>${group.title}</span>
        </div>
        <div class="menu-tree ${group.open ? '' : 'hidden'}" data-tree="${idx}">${group.items.map(sidebarItem).join('')}</div>
      </div>`).join('');

    document.querySelectorAll('[data-head]').forEach(head => {
      head.addEventListener('click', () => {
        const tree  = document.querySelector(`[data-tree="${head.dataset.head}"]`);
        const caret = head.querySelector('.menu-caret');
        tree.classList.toggle('hidden');
        caret.classList.toggle('open', !tree.classList.contains('hidden'));
      });
    });

    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      document.getElementById('sidebar-inner').classList.toggle('hidden');
    });

    document.getElementById('logout-btn').addEventListener('click', () => { location.href = '/logout'; });

    /* Sidebar search — auto-expands groups with matches */
    document.getElementById('sidebar-search').addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.menu-group').forEach((group, idx) => {
        const items   = group.querySelectorAll('.menu-item');
        const tree    = group.querySelector('[data-tree]');
        const caret   = group.querySelector('.menu-caret');
        let visible   = 0;
        items.forEach(item => {
          const show = !q || item.dataset.label.includes(q);
          item.classList.toggle('hidden', !show);
          if (show) visible++;
        });
        const hasMatch = visible > 0;
        group.classList.toggle('hidden', q.length > 0 && !hasMatch);
        if (q && hasMatch && tree) {
          tree.classList.remove('hidden');
          caret && caret.classList.add('open');
        } else if (!q && tree) {
          // restore original collapse state from sidebar config
          const orig = sidebar[idx];
          tree.classList.toggle('hidden', !orig.open);
          caret && caret.classList.toggle('open', orig.open);
        }
      });
    });
  }

  /* ── Dashboard ────────────────────────────────────── */
  async function renderDashboard() {
    document.getElementById('app').innerHTML = shell(`
      <div class="breadcrumb">Home &rsaquo; Dashboard</div>
      <section class="dashboard-grid">
        <div class="chart-wrap"><canvas id="opsModuleChart" width="360" height="360"></canvas></div>
        <div class="content-text">
          <h1 class="page-title">${SHORT_PRODUCT_NAME}</h1>
          <p class="page-subtitle">${PRODUCT_SUBTITLE}</p>
          <p class="page-meta">${PRODUCT_BUILD}</p>
          <p>${FULL_PRODUCT_NAME} is an Industry 4.0-ready digital manufacturing platform designed for connected shop-floor operations. It collects and analyzes operational data from machines, processes, and operators to deliver real-time visibility, faster decisions, and stronger production control.</p>
          <p>Typical manufacturing facilities of today are still a patchwork of manual processes and legacy software systems developed decades ago. The roadblocks to incremental improvements and support resources to those systems were much expensive. When these old systems crash, it can impact your business negatively.</p>
        </div>
      </section>
      <section class="dashboard-bottom">
        <p>Manufacturers that want resilient operations need a unified digital backbone instead of disconnected spreadsheets and legacy tools. ${SHORT_PRODUCT_NAME} provides the platform to modernize factory execution with real-time monitoring, smart analytics, version-controlled configurations, and workflow-driven operations.</p>
        <p>It also has the feature to create RFID tags that embed the product configuration of a particular product or part. This helps in the shop floor to broadcast the product configuration information to machines such as recipe details, materials used, and tools required.</p>
      </section>`);

    renderSidebar();
    if (!window.Chart) return;

    const themePalette = ['#0078D4', '#107C10', '#FFB900', '#E81123'];
    const colors = dashboardModules.map((_, index) => themePalette[index % themePalette.length]);
    const ctx = document.getElementById('opsModuleChart');

    const centerPlugin = {
      id: 'centerPlugin',
      afterDraw(chart) {
        const meta = chart.getDatasetMeta(1);
        if (!meta?.data?.length) return;
        const { ctx: c } = chart;
        const { x, y } = meta.data[0];
        const radius = Math.max(58, meta.data[0].innerRadius - 8);
        const g = c.createRadialGradient(x-16, y-16, 8, x, y, radius);
        g.addColorStop(0, '#0078D4'); g.addColorStop(1, '#FFB900');
        c.save();
        c.fillStyle = g; c.beginPath(); c.arc(x, y, radius, 0, Math.PI*2); c.fill();
        c.fillStyle = '#ffffff'; c.font = 'bold 17px Inter, Segoe UI, sans-serif';
        c.textAlign = 'center'; c.fillText(SHORT_PRODUCT_NAME, x, y+6); c.restore();
      }
    };

    const labelPlugin = {
      id: 'labelPlugin',
      afterDatasetsDraw(chart) {
        const { ctx: c } = chart;
        const meta = chart.getDatasetMeta(0);
        c.save(); c.fillStyle = '#fff'; c.font = 'bold 10px Inter, Segoe UI, sans-serif';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        meta.data.forEach((arc, i) => {
          const angle = (arc.startAngle + arc.endAngle) / 2;
          const r = (arc.outerRadius + arc.innerRadius) / 2 + 18;
          c.fillText(dashboardModules[i], arc.x + Math.cos(angle)*r, arc.y + Math.sin(angle)*r);
        });
        c.restore();
      }
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dashboardModules,
        datasets: [
          { data: dashboardModules.map(() => 10), backgroundColor: colors, borderColor: '#ffffff', borderWidth: 2 },
          { data: dashboardModules.map(() => 10), backgroundColor: colors, borderColor: '#ffffff', borderWidth: 1 }
        ]
      },
      options: { cutout: '36%', plugins: { legend: { display: false } } },
      plugins: [centerPlugin, labelPlugin]
    });
  }

  async function renderShopfloorConsole() {
    const config = MODULES.shopfloorConsole;
    let rows = (config.staticRows || []).map(row => ({ ...row }));

    const apiResult = await requestJson('/api/shopfloor-console');
    if (apiResult.ok) {
      if (Array.isArray(apiResult.data)) {
        rows = apiResult.data;
      } else if (Array.isArray(apiResult.data?.rows)) {
        rows = apiResult.data.rows;
      }
    }

    document.getElementById('app').innerHTML = shopfloorShell(`
      <section class="panel sf-panel">
        <div class="sf-panel-title">Station Plan Vs. Actual</div>
        <div class="sf-kpi-grid">
          <div class="sf-kpi-card sf-red">
            <div class="sf-kpi-title">Plan Sample</div>
            <div class="sf-kpi-value" id="sf-plan-sample">
              <span class="sf-kpi-number">0</span>
              <span class="sf-kpi-unit">Items</span>
            </div>
          </div>
          <div class="sf-kpi-card sf-blue">
            <div class="sf-kpi-title">Actual Sample</div>
            <div class="sf-kpi-value" id="sf-actual-sample">
              <span class="sf-kpi-number">0</span>
              <span class="sf-kpi-unit">Items</span>
            </div>
          </div>
          <div class="sf-kpi-card sf-green">
            <div class="sf-kpi-title">OK Quantity</div>
            <div class="sf-kpi-value" id="sf-ok-qty">
              <span class="sf-kpi-number">0</span>
              <span class="sf-kpi-unit">Items</span>
            </div>
          </div>
          <div class="sf-kpi-card sf-yellow">
            <div class="sf-kpi-title">NOT OK Quantity</div>
            <div class="sf-kpi-value" id="sf-nok-qty">
              <span class="sf-kpi-number">0</span>
              <span class="sf-kpi-unit">Items</span>
            </div>
          </div>
        </div>
      </section>
      <section class="panel sf-panel sf-filter-panel">
        <div class="sf-panel-title">QC Dashboard Filter</div>
        <div class="sf-filter-grid">
          <div class="field">
            <label>Equipment</label>
            <input id="sf-equipment" type="text" placeholder="Equipment" />
          </div>
          <div class="sf-filter-actions">
            <button class="sf-outline-btn" id="sf-clear-btn" type="button">Clear</button>
            <button class="sf-outline-btn sf-primary" id="sf-filter-btn" type="button">Filter</button>
          </div>
        </div>
      </section>
      <section class="panel sf-panel sf-table-panel">
        <div class="table-wrap sf-table-wrap">
          <table class="sf-table">
            <thead id="sf-table-head"></thead>
            <tbody id="sf-table-body"></tbody>
          </table>
        </div>
      </section>`);
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => { location.href = '/logout'; });
    }

    const state = {
      rows,
      filtered: [],
      selected: new Set()
    };

    const equipmentInput = document.getElementById('sf-equipment');
    const clearBtn = document.getElementById('sf-clear-btn');
    const filterBtn = document.getElementById('sf-filter-btn');
    const headEl = document.getElementById('sf-table-head');
    const bodyEl = document.getElementById('sf-table-body');

    function formatCount(value) {
      const num = Number(value || 0);
      return num.toLocaleString();
    }

    function updateCards(rows) {
      const totals = rows.reduce((acc, row) => {
        acc.plan += Number(row.sample_to_be_picked || 0);
        acc.actual += Number(row.sample_picked || 0);
        acc.ok += Number(row.ok_quantity || 0);
        acc.nok += Number(row.not_ok_quantity || 0);
        return acc;
      }, { plan: 0, actual: 0, ok: 0, nok: 0 });

      document.getElementById('sf-plan-sample').innerHTML = `<span class="sf-kpi-number">${formatCount(totals.plan)}</span><span class="sf-kpi-unit">Items</span>`;
      document.getElementById('sf-actual-sample').innerHTML = `<span class="sf-kpi-number">${formatCount(totals.actual)}</span><span class="sf-kpi-unit">Items</span>`;
      document.getElementById('sf-ok-qty').innerHTML = `<span class="sf-kpi-number">${formatCount(totals.ok)}</span><span class="sf-kpi-unit">Items</span>`;
      document.getElementById('sf-nok-qty').innerHTML = `<span class="sf-kpi-number">${formatCount(totals.nok)}</span><span class="sf-kpi-unit">Items</span>`;
    }

    function renderTable(rows) {
      const columns = config.columns || [];
      headEl.innerHTML = `<tr><th><input id="sf-select-all" type="checkbox"></th>${columns.map(col => `<th>${col.label}</th>`).join('')}</tr>`;

      if (!rows.length) {
        bodyEl.innerHTML = `<tr><td class="upload-empty" colspan="${columns.length + 1}">No data to display.</td></tr>`;
        return;
      }

      bodyEl.innerHTML = rows.map(row => `
        <tr>
          <td><input class="sf-row-check" type="checkbox" data-id="${row.id}"></td>
          ${columns.map(col => `<td>${escapeHtml(row[col.key] ?? 0)}</td>`).join('')}
        </tr>`).join('');

      const selectAll = document.getElementById('sf-select-all');
      selectAll.addEventListener('change', () => {
        rows.forEach(row => selectAll.checked ? state.selected.add(row.id) : state.selected.delete(row.id));
        document.querySelectorAll('.sf-row-check').forEach(cb => { cb.checked = selectAll.checked; });
      });

      document.querySelectorAll('.sf-row-check').forEach(cb =>
        cb.addEventListener('change', () => {
          const id = Number(cb.dataset.id);
          cb.checked ? state.selected.add(id) : state.selected.delete(id);
        })
      );
    }

    function applyFilter() {
      const query = String(equipmentInput.value || '').trim().toLowerCase();
      state.filtered = !query
        ? [...state.rows]
        : state.rows.filter(row => String(row.equipment || '').toLowerCase().includes(query));
      updateCards(state.filtered);
      renderTable(state.filtered);
    }

    clearBtn.addEventListener('click', () => {
      equipmentInput.value = '';
      applyFilter();
    });
    filterBtn.addEventListener('click', applyFilter);

    applyFilter();
  }

  /* ── Generic Page Renderer ────────────────────────── */
  function renderFilters(config) {
    return config.filters.map(f => {
      if (f.type === 'select') {
        return `<div class="field"><label>${f.label}</label><select data-filter="${f.key}">${f.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}</select></div>`;
      }
      return `<div class="field"><label>${f.label}</label><input type="${f.type}" data-filter="${f.key}" /></div>`;
    }).join('');
  }

  const BTN_LABELS = {
    search:'Search',
    reset:'Reset',
    add:'Add',
    edit:'Edit',
    view:'View',
    reports:'Reports',
    copy:'Copy',
    delete:'Delete',
    release:'Release',
    activate:'Activate',
    archive:'Archive',
    export:'Export'
  };

  function buttonClassName(key, { secondary = false } = {}) {
    const classes = ['btn'];
    if (key) classes.push(`btn-${key}`);
    if (secondary) classes.push('secondary', 'btn-secondary');
    return [...new Set(classes)].join(' ');
  }

  function buttonHtml(key) {
    return `<button class="${buttonClassName(key, { secondary: key === 'reset' })}" data-action="${key}">${BTN_LABELS[key]}</button>`;
  }

  function normalizeValue(value, field) {
    if (field.type === 'number') return Number(value || 0);
    if (field.type === 'date')   return value || null;
    if (field.type === 'select') return String(value ?? '');
    return value ?? '';
  }

  function formatInputValue(value, field) {
    if (field.type === 'date') {
      return formatDateTimeCell(value);
    }
    return String(value ?? '');
  }

  function closeModal() {
    const o = document.getElementById('modal-overlay');
    if (o) o.remove();
  }

  function openModal(title, bodyHtml, onSave) {
    closeModal();
    const wrapper = document.createElement('div');
    wrapper.id = 'modal-overlay';
    wrapper.className = 'modal-overlay';
    wrapper.innerHTML = `
      <div class="modal">
        <div class="modal-header"><strong>${title}</strong><button class="btn secondary" id="modal-close">✕</button></div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">
          <button class="${buttonClassName('secondary', { secondary: true })}" id="modal-cancel">Cancel</button>
          ${onSave ? `<button class="${buttonClassName('add')}" id="modal-save">Save</button>` : ''}
        </div>
      </div>`;
    document.body.appendChild(wrapper);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    wrapper.addEventListener('click', e => { if (e.target === wrapper) closeModal(); });
    if (onSave) document.getElementById('modal-save').addEventListener('click', onSave);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  async function requestJson(url, opts = {}) {
    try {
      const res = await fetch(url, opts);
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      return {
        ok: false,
        status: 0,
        data: { error: 'Network error: ' + err.message }
      };
    }
  }

  function formatDateTimeCell(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function formatLifecycleCell(value) {
    const state = String(value ?? 'Draft');
    const cls = state.toLowerCase().replace(/\s+/g, '-');
    return `<span class="pc-state-badge ${cls}">${escapeHtml(state)}</span>`;
  }

  function formatRevisionCell(row) {
    const badge = Number(row.is_default) === 1 ? '<span class="pc-default-badge">Active</span>' : '';
    return `<span class="pc-revision-text">${escapeHtml(row.revision_name ?? '')}</span>${badge}`;
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function downloadCsv(filename, columns, rows) {
    const header = columns.map((column) => csvEscape(column.label)).join(',');
    const lines = rows.map((row) =>
      columns.map((column) => {
        const value = column.format ? column.format(row) : row[column.key];
        return csvEscape(value);
      }).join(',')
    );
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function renderProductConfigPage(config) {
    document.getElementById('app').innerHTML = shell(`
      <div class="breadcrumb">${config.breadcrumb}</div>
      <div class="panel product-config-panel">
        <div class="product-config-filter-grid" id="product-config-filter-grid">${renderFilters(config)}</div>
        <div class="product-config-filter-actions">
          <button class="${buttonClassName('search')}" id="product-config-search-btn" type="button">Search</button>
          <button class="${buttonClassName('reset', { secondary: true })}" id="product-config-reset-btn" type="button">Reset</button>
        </div>
      </div>
      <div class="toolbar product-config-toolbar">${config.actions.map(buttonHtml).join('')}</div>
      <div class="table-wrap">
        <table>
          <thead id="product-config-head"></thead>
          <tbody id="product-config-body"></tbody>
        </table>
      </div>
      <div class="pagination">
        <div class="page-controls">
          <button class="${buttonClassName('reset', { secondary: true })}" id="product-config-prev">&#8592; Prev</button>
          <span id="product-config-page-info"></span>
          <button class="${buttonClassName('reset', { secondary: true })}" id="product-config-next">Next &#8594;</button>
        </div>
        <div class="page-size-wrap">
          Rows:
          <select id="product-config-page-size">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div id="product-config-view-info"></div>
      </div>`);

    renderSidebar();

    const state = {
      rows: [],
      filtered: [],
      selected: new Set(),
      page: 1,
      pageSize: 10,
      sortKey: null,
      sortDir: 'asc'
    };

    function selectedRows() {
      return state.rows.filter((row) => state.selected.has(row.id));
    }

    function selectedSingle(actionLabel) {
      const rows = selectedRows();
      if (rows.length !== 1) {
        showToast(`Select exactly one row to ${actionLabel}.`, 'warning');
        return null;
      }
      return rows[0];
    }

    function renderCell(row, column) {
      if (column.format) return column.format(row);
      return escapeHtml(row[column.key] ?? '');
    }

    function renderTable() {
      const start = (state.page - 1) * state.pageSize;
      const pageRows = state.filtered.slice(start, start + state.pageSize);
      const maxPage = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));

      document.getElementById('product-config-head').innerHTML =
        `<tr><th><input id="product-config-select-all" type="checkbox"></th>${config.columns.map((column) => {
          const sortKey = column.sortKey || column.key;
          const suffix = state.sortKey === sortKey ? (state.sortDir === 'asc' ? ' ^' : ' v') : '';
          return `<th data-sort="${sortKey}">${column.label}${suffix}</th>`;
        }).join('')}</tr>`;

      document.getElementById('product-config-body').innerHTML = pageRows.length
        ? pageRows.map((row) =>
            `<tr>
              <td><input class="product-config-row-check" type="checkbox" data-id="${row.id}" ${state.selected.has(row.id) ? 'checked' : ''}></td>
              ${config.columns.map((column) => `<td>${renderCell(row, column)}</td>`).join('')}
            </tr>`
          ).join('')
        : `<tr><td class="upload-empty" colspan="${config.columns.length + 1}">No data to display.</td></tr>`;

      document.getElementById('product-config-page-info').textContent = `Page ${state.page} / ${maxPage}`;
      const from = state.filtered.length ? start + 1 : 0;
      const to = Math.min(start + state.pageSize, state.filtered.length);
      document.getElementById('product-config-view-info').textContent = `Showing ${from}-${to} of ${state.filtered.length}`;

      document.querySelectorAll('[data-sort]').forEach((th) => {
        th.addEventListener('click', () => {
          const key = th.dataset.sort;
          state.sortDir = state.sortKey === key ? (state.sortDir === 'asc' ? 'desc' : 'asc') : 'asc';
          state.sortKey = key;
          const dir = state.sortDir === 'asc' ? 1 : -1;
          state.filtered.sort((a, b) =>
            String(a[key] ?? '').localeCompare(String(b[key] ?? ''), undefined, { numeric: true }) * dir
          );
          renderTable();
        });
      });

      const selectAll = document.getElementById('product-config-select-all');
      if (selectAll) {
        selectAll.addEventListener('change', () => {
          pageRows.forEach((row) => {
            if (selectAll.checked) state.selected.add(row.id);
            else state.selected.delete(row.id);
          });
          renderTable();
        });
      }

      document.querySelectorAll('.product-config-row-check').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          const id = Number(checkbox.dataset.id);
          if (checkbox.checked) state.selected.add(id);
          else state.selected.delete(id);
        });
      });
    }

    function applyFilters() {
      const filters = {};
      const filterMeta = config.filters.reduce((acc, field) => {
        acc[field.key] = field;
        return acc;
      }, {});
      document.querySelectorAll('[data-filter]').forEach((input) => {
        filters[input.dataset.filter] = String(input.value ?? '').trim().toLowerCase();
      });

      state.filtered = state.rows.filter((row) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          const field = filterMeta[key];
          if (!field) return true;
          if (key === 'is_default') return String(Number(row.is_default)) === value;
          if (field.type === 'select') return String(row[key] ?? '').toLowerCase() === value;
          if (field.type === 'date') return formatDateTimeCell(row[key]).toLowerCase() === value;
          return String(row[key] ?? '').toLowerCase().includes(value);
        })
      );

      if (state.sortKey) {
        const dir = state.sortDir === 'asc' ? 1 : -1;
        state.filtered.sort((a, b) =>
          String(a[state.sortKey] ?? '').localeCompare(String(b[state.sortKey] ?? ''), undefined, { numeric: true }) * dir
        );
      }

      state.page = 1;
      renderTable();
    }

    async function load() {
      const response = await requestJson(config.endpoint);
      if (!response.ok) {
        showToast(response.data.error || `Error ${response.status}`, 'error');
        return;
      }

      state.rows = response.data || [];
      state.selected.clear();
      applyFilters();
    }

    function openConfigForm(mode, row) {
      if (mode === 'Edit' && row[config.lifecycleField] !== 'Draft') {
        showToast('Only Draft revisions can be edited.', 'warning');
        return;
      }

      const body = `<div class="modal-grid">${config.formFields.map((field) => {
        const value = row ? row[field.key] ?? '' : '';
        const readOnly = mode === 'Edit' && field.readOnlyOnEdit ? 'readonly' : '';
        if (field.type === 'select') {
          return `<div class="field"><label>${field.label}</label><select data-form="${field.key}">${field.options.map((option) =>
            `<option value="${escapeHtml(option.value)}" ${String(value) === String(option.value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`
          ).join('')}</select></div>`;
        }
        return `<div class="field"><label>${field.label}</label><input data-form="${field.key}" type="${field.type}" value="${escapeHtml(formatInputValue(value, field))}" ${readOnly}></div>`;
      }).join('')}</div>`;

      openModal(`${mode} ${config.title}`, body, async () => {
        const payload = {};
        config.formFields.forEach((field) => {
          const input = document.querySelector(`[data-form="${field.key}"]`);
          payload[field.key] = normalizeValue(input?.value, field);
        });

        const response = await requestJson(
          mode === 'Add' ? config.endpoint : `${config.endpoint}/${row.id}`,
          {
            method: mode === 'Add' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          showToast(response.data.error || `Error ${response.status}`, 'error');
          return;
        }

        showToast(response.data.message || `${config.title} saved successfully.`, 'success');
        closeModal();
        await load();
      });
    }

    function openConfigView(row) {
      const html = `<table style="width:100%;border-collapse:collapse">${config.viewFields.map((field) => {
        const value = field.format ? field.format(row) : row[field.key] ?? '';
        return `<tr>
          <td style="border:1px solid #dde5ef;padding:8px 10px;width:40%;font-weight:600;background:#f5f8fc">${field.label}</td>
          <td style="border:1px solid #dde5ef;padding:8px 10px">${escapeHtml(value)}</td>
        </tr>`;
      }).join('')}</table>`;
      openModal(`View - ${config.title}`, html, null);
    }

    async function runRowAction(action, row) {
      const actionMap = {
        copy: { url: `${config.endpoint}/${row.id}/copy`, message: `${config.title} revision copied successfully.` },
        release: { url: `${config.endpoint}/${row.id}/release`, message: `${config.title} revision released successfully.` },
        activate: { url: `${config.endpoint}/${row.id}/activate`, message: `${config.title} revision activated successfully.` },
        archive: { url: `${config.endpoint}/${row.id}/archive`, message: `${config.title} revision archived successfully.` }
      };

      const meta = actionMap[action];
      if (!meta) return;

      const response = await requestJson(meta.url, { method: 'POST' });
      if (!response.ok) {
        showToast(response.data.error || `Error ${response.status}`, 'error');
        return;
      }

      showToast(response.data.message || meta.message, 'success');
      await load();
    }

    function confirmAction(title, message, onConfirm) {
      openModal(title, `<p style="margin:8px 0">${message}</p>`, onConfirm);
    }

    document.getElementById('product-config-search-btn').addEventListener('click', applyFilters);
    document.getElementById('product-config-reset-btn').addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((input) => { input.value = ''; });
      applyFilters();
    });

    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.dataset.action;

        if (action === 'add') {
          openConfigForm('Add', null);
          return;
        }

        if (action === 'edit') {
          const row = selectedSingle('edit');
          if (row) openConfigForm('Edit', row);
          return;
        }

        if (action === 'view') {
          const row = selectedSingle('view');
          if (row) openConfigView(row);
          return;
        }

        if (action === 'copy') {
          const row = selectedSingle('copy');
          if (!row) return;
          confirmAction('Confirm Copy', 'Create a new revision from the selected record?', async () => {
            closeModal();
            await runRowAction('copy', row);
          });
          return;
        }

        if (action === 'release') {
          const row = selectedSingle('release');
          if (!row) return;
          confirmAction('Confirm Release', 'Release the selected revision?', async () => {
            closeModal();
            await runRowAction('release', row);
          });
          return;
        }

        if (action === 'archive') {
          const row = selectedSingle('archive');
          if (!row) return;
          confirmAction('Confirm Archive', 'Archive the selected revision?', async () => {
            closeModal();
            await runRowAction('archive', row);
          });
          return;
        }

        if (action === 'activate') {
          const row = selectedSingle('activate');
          if (!row) return;
          confirmAction('Confirm Activate', 'Activate the selected Released revision?', async () => {
            closeModal();
            await runRowAction('activate', row);
          });
          return;
        }

        if (action === 'export') {
          const rows = state.filtered.length ? state.filtered : state.rows;
          downloadCsv(
            `${config.title.toLowerCase().replace(/\s+/g, '-')}.csv`,
            config.exportColumns,
            rows
          );
          showToast(`${config.title} export generated.`, 'success');
        }
      });
    });

    document.getElementById('product-config-prev').addEventListener('click', () => {
      if (state.page > 1) {
        state.page--;
        renderTable();
      }
    });

    document.getElementById('product-config-next').addEventListener('click', () => {
      const maxPage = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
      if (state.page < maxPage) {
        state.page++;
        renderTable();
      }
    });

    document.getElementById('product-config-page-size').addEventListener('change', (event) => {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      renderTable();
    });

    await load();
  }

  async function renderUploadPage(config) {
    document.getElementById('app').innerHTML = shell(`
      <div class="breadcrumb">${config.breadcrumb}</div>
      <div class="panel upload-panel">
        <div class="field">
          <label>Upload File</label>
          <div class="upload-input-row">
            <label class="${buttonClassName('reset', { secondary: true })} upload-choose-btn" for="upload-file-input">Choose File</label>
            <span id="upload-file-name" class="upload-file-name">No file selected</span>
            <input id="upload-file-input" class="upload-file-input" type="file" accept=".csv,.xlsx" />
            <button class="${buttonClassName('search')}" id="upload-preview-btn" type="button">Upload</button>
          </div>
          <div class="upload-help">Accepted formats: .csv, .xlsx</div>
        </div>
      </div>
      <div class="toolbar upload-toolbar">
        <button class="${buttonClassName('add')}" id="upload-post-btn" type="button">Post</button>
        <button class="${buttonClassName('view')}" id="upload-view-btn" type="button">View</button>
      </div>
      <div class="upload-summary" id="upload-summary">Choose a file and upload it to preview the rows.</div>
      <div class="table-wrap">
        <table>
          <thead id="upload-table-head"></thead>
          <tbody id="upload-table-body"></tbody>
        </table>
      </div>`);

    renderSidebar();

    const state = {
      mode: 'idle',
      rows: [],
      isBusy: false
    };

    const fileInput = document.getElementById('upload-file-input');
    const fileName = document.getElementById('upload-file-name');
    const previewButton = document.getElementById('upload-preview-btn');
    const postButton = document.getElementById('upload-post-btn');
    const viewButton = document.getElementById('upload-view-btn');
    const summaryEl = document.getElementById('upload-summary');
    const headEl = document.getElementById('upload-table-head');
    const bodyEl = document.getElementById('upload-table-body');

    function setSummary(message, variant = 'info') {
      summaryEl.className = `upload-summary ${variant}`;
      summaryEl.textContent = message;
    }

    function hasInvalidRows() {
      return state.rows.some((row) => Array.isArray(row.errors) && row.errors.length > 0);
    }

    function syncButtons() {
      previewButton.disabled = state.isBusy;
      viewButton.disabled = state.isBusy;
      postButton.disabled = state.isBusy || state.mode !== 'preview' || !state.rows.length || hasInvalidRows();
    }

    function renderTable() {
      const columns = [
        { key: 'rowNumber', label: 'Row Number' },
        ...config.dataColumns,
        { key: 'errors', label: 'Errors' }
      ];

      headEl.innerHTML = `<tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr>`;

      if (!state.rows.length) {
        bodyEl.innerHTML = `<tr><td class="upload-empty" colspan="${columns.length}">No data to display.</td></tr>`;
        return;
      }

      bodyEl.innerHTML = state.rows.map((row, index) => {
        const values = row.values || {};
        const errors = Array.isArray(row.errors) ? row.errors : [];
        const isInvalid = errors.length > 0;
        const cells = config.dataColumns.map((column) => `<td>${escapeHtml(values[column.key] ?? '')}</td>`).join('');
        const errorHtml = errors.length
          ? errors.map((error) => `<div class="upload-error-item">${escapeHtml(error)}</div>`).join('')
          : '<span class="upload-no-errors">-</span>';

        return `
          <tr class="${isInvalid ? 'upload-row-invalid' : ''}">
            <td>${escapeHtml(row.rowNumber ?? index + 1)}</td>
            ${cells}
            <td class="upload-errors-cell">${errorHtml}</td>
          </tr>`;
      }).join('');
    }

    async function loadViewRows() {
      state.isBusy = true;
      syncButtons();

      const response = await requestJson(config.viewEndpoint);
      state.isBusy = false;

      if (!response.ok) {
        setSummary(response.data.error || 'Failed to load uploaded records.', 'error');
        showToast(response.data.error || `Error ${response.status}`, 'error');
        syncButtons();
        return;
      }

      state.mode = 'view';
      state.rows = (response.data || []).map((row, index) => config.mapViewRow(row, index));
      renderTable();
      setSummary(
        state.rows.length
          ? `Viewing ${state.rows.length} posted record(s).`
          : 'No posted records are available for this upload type yet.',
        state.rows.length ? 'success' : 'info'
      );
      syncButtons();
    }

    fileInput.addEventListener('change', () => {
      fileName.textContent = fileInput.files?.[0]?.name || 'No file selected';
    });

    previewButton.addEventListener('click', async () => {
      const file = fileInput.files?.[0];
      if (!file) {
        showToast('Choose a .csv or .xlsx file first.', 'warning');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      state.isBusy = true;
      syncButtons();
      setSummary(`Uploading ${file.name} for preview...`, 'info');

      const response = await requestJson(config.uploadEndpoint, {
        method: 'POST',
        body: formData
      });

      state.isBusy = false;

      if (!response.ok) {
        setSummary(response.data.error || 'Upload preview failed.', 'error');
        showToast(response.data.error || `Error ${response.status}`, 'error');
        syncButtons();
        return;
      }

      state.mode = 'preview';
      state.rows = response.data.rows || [];
      renderTable();

      const summary = response.data.summary || { totalRows: 0, validRows: 0, invalidRows: 0 };
      setSummary(
        `Preview ready. Total: ${summary.totalRows} | Valid: ${summary.validRows} | Errors: ${summary.invalidRows}`,
        summary.invalidRows > 0 ? 'warning' : 'success'
      );
      showToast(`${config.title} preview loaded.`, summary.invalidRows > 0 ? 'warning' : 'success');
      syncButtons();
    });

    postButton.addEventListener('click', async () => {
      if (state.mode !== 'preview' || !state.rows.length) {
        showToast('Upload a file to build a preview before posting.', 'warning');
        return;
      }
      if (hasInvalidRows()) {
        showToast('Resolve the preview errors before posting.', 'warning');
        return;
      }

      state.isBusy = true;
      syncButtons();
      setSummary('Posting preview rows to the database...', 'info');

      const response = await requestJson(config.uploadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: state.rows })
      });

      state.isBusy = false;

      if (!response.ok) {
        if (Array.isArray(response.data.rows)) {
          state.mode = 'preview';
          state.rows = response.data.rows;
          renderTable();
          const summary = response.data.summary || { totalRows: state.rows.length, validRows: 0, invalidRows: state.rows.length };
          setSummary(
            `Posting blocked. Total: ${summary.totalRows} | Valid: ${summary.validRows} | Errors: ${summary.invalidRows}`,
            'error'
          );
        } else {
          setSummary(response.data.error || 'Posting failed.', 'error');
        }
        showToast(response.data.error || `Error ${response.status}`, 'error');
        syncButtons();
        return;
      }

      showToast(response.data.message || 'Records posted successfully.', 'success');
      fileInput.value = '';
      fileName.textContent = 'No file selected';
      await loadViewRows();
    });

    viewButton.addEventListener('click', loadViewRows);

    renderTable();
    syncButtons();
  }

  async function renderAdminPage(config) {
    document.getElementById('app').innerHTML = shell(`
      <div class="breadcrumb">${config.breadcrumb}</div>
      <div class="panel"><div class="filter-grid" id="filter-grid">${renderFilters(config)}</div></div>
      <div class="toolbar">${config.buttons.map(buttonHtml).join('')}</div>
      <div class="table-wrap">
        <table>
          <thead id="table-head"></thead>
          <tbody id="table-body"></tbody>
        </table>
      </div>
      <div class="pagination">
        <div class="page-controls">
          <button class="${buttonClassName('reset', { secondary: true })}" id="prev-page">&#8592; Prev</button>
          <span id="page-info"></span>
          <button class="${buttonClassName('reset', { secondary: true })}" id="next-page">Next &#8594;</button>
        </div>
        <div class="page-size-wrap">
          Rows:
          <select id="page-size-sel">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div id="view-info"></div>
      </div>`);

    renderSidebar();

    const isStatic = Array.isArray(config.staticRows);

    const state = {
      rows: [], filtered: [], selected: new Set(),
      page: 1, pageSize: 10, sortKey: null, sortDir: 'asc'
    };

    /* ── API ──────────────────────────────────────── */
    async function apiFetch(url, opts = {}) {
      try {
        const res = await fetch(url, opts);
        const data = await res.json();
        if (!res.ok) { showToast(data.error || `Error ${res.status}`, 'error'); return null; }
        return data;
      } catch (err) {
        showToast('Network error: ' + err.message, 'error'); return null;
      }
    }

    async function load() {
      if (isStatic) {
        state.rows = config.staticRows.map(row => ({ ...row }));
        applyFilters();
        return;
      }

      const data = await apiFetch(config.endpoint);
      if (data) { state.rows = data; applyFilters(); }
    }

    /* ── Filters & Sort ───────────────────────────── */
    function applyFilters() {
      const filters = {};
      document.querySelectorAll('[data-filter]').forEach(input => {
        filters[input.dataset.filter] = String(input.value ?? '').trim().toLowerCase();
      });
      const boolKeys = new Set(['is_active','is_immutable','is_sold','has_virtual_bom','is_default']);
      const exactKeys = new Set(['type']);

      state.filtered = state.rows.filter(row =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          if (boolKeys.has(key)) return String(Number(row[key])) === value;
          if (exactKeys.has(key)) return String(row[key] ?? '').toLowerCase() === value;
          return String(row[key] ?? '').toLowerCase().includes(value);
        })
      );
      if (state.sortKey) sortRows(state.sortKey, false);
      state.page = 1;
      renderTable();
    }

    function sortRows(key, rerender = true) {
      state.sortDir = state.sortKey === key ? (state.sortDir === 'asc' ? 'desc' : 'asc') : 'asc';
      state.sortKey = key;
      const dir = state.sortDir === 'asc' ? 1 : -1;
      state.filtered.sort((a, b) => String(a[key] ?? '').localeCompare(String(b[key] ?? ''), undefined, { numeric: true }) * dir);
      if (rerender) renderTable();
    }

    function selectedRows() { return state.rows.filter(r => state.selected.has(r.id)); }

    /* ── Table Render ─────────────────────────────── */
    function renderTable() {
      const start    = (state.page - 1) * state.pageSize;
      const pageRows = state.filtered.slice(start, start + state.pageSize);
      const maxPage  = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));

      document.getElementById('table-head').innerHTML =
        `<tr><th><input id="select-all" type="checkbox"></th>${config.columns.map(col =>
          `<th data-sort="${col.key}">${col.label}${state.sortKey === col.key ? (state.sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>`).join('')}</tr>`;

      document.getElementById('table-body').innerHTML = pageRows.map(row =>
        `<tr><td><input class="row-check" type="checkbox" data-id="${row.id}" ${state.selected.has(row.id) ? 'checked' : ''}></td>${
          config.columns.map(col => `<td>${col.format ? col.format(row[col.key]) : (row[col.key] ?? '')}</td>`).join('')
        }</tr>`).join('');

      document.getElementById('page-info').textContent = `Page ${state.page} / ${maxPage}`;
      const from = state.filtered.length ? start + 1 : 0;
      const to   = Math.min(start + state.pageSize, state.filtered.length);
      document.getElementById('view-info').textContent = `Showing ${from}–${to} of ${state.filtered.length}`;

      document.querySelectorAll('[data-sort]').forEach(th =>
        th.addEventListener('click', () => sortRows(th.dataset.sort)));

      const selectAll = document.getElementById('select-all');
      selectAll.addEventListener('change', () => {
        pageRows.forEach(row => selectAll.checked ? state.selected.add(row.id) : state.selected.delete(row.id));
        renderTable();
      });
      document.querySelectorAll('.row-check').forEach(cb =>
        cb.addEventListener('change', () => {
          const id = Number(cb.dataset.id);
          cb.checked ? state.selected.add(id) : state.selected.delete(id);
        }));
    }

    /* ── Form Modal ───────────────────────────────── */
    function openForm(mode, row) {
      const body = `<div class="modal-grid">${config.formFields.map(field => {
        const value = row ? row[field.key] ?? '' : '';
        if (field.type === 'select') {
          return `<div class="field"><label>${field.label}</label><select data-form="${field.key}">${
            field.options.map(o => `<option value="${o.value}" ${String(value) === String(o.value) ? 'selected' : ''}>${o.label}</option>`).join('')
          }</select></div>`;
        }
        return `<div class="field"><label>${field.label}</label><input data-form="${field.key}" type="${field.type}" value="${String(value ?? '').replace(/"/g, '&quot;')}" /></div>`;
      }).join('')}</div>`;

      openModal(`${mode} ${config.title}`, body, async () => {
        const payload = {};
        config.formFields.forEach(field => {
          const input = document.querySelector(`[data-form="${field.key}"]`);
          payload[field.key] = normalizeValue(input?.value, field);
        });
        let result;
        if (mode === 'Add') {
          result = await apiFetch(config.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } else {
          result = await apiFetch(`${config.endpoint}/${row.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }
        if (result) { showToast(`${config.title} ${mode === 'Add' ? 'created' : 'updated'} successfully`, 'success'); closeModal(); await load(); }
      });
    }

    function openView(row) {
      const html = `<table style="width:100%;border-collapse:collapse">${config.columns.map(c =>
        `<tr><td style="border:1px solid #dde5ef;padding:8px 10px;width:40%;font-weight:600;background:#f5f8fc">${c.label}</td>
             <td style="border:1px solid #dde5ef;padding:8px 10px">${c.format ? c.format(row[c.key]) : row[c.key] ?? ''}</td></tr>`
      ).join('')}</table>`;
      openModal(`View - ${config.title}`, html, null);
    }

    /* ── Button Actions ───────────────────────────── */
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.action;

        if (isStatic && ['add','edit','delete','copy'].includes(action)) {
          showToast('This module is currently read-only.', 'info');
          return;
        }

        if (action === 'search') { applyFilters(); return; }
        if (action === 'reset')  { document.querySelectorAll('[data-filter]').forEach(i => { i.value = ''; }); applyFilters(); return; }
        if (action === 'add')    { openForm('Add', null); return; }

        if (action === 'edit') {
          const rows = selectedRows();
          if (rows.length !== 1) { showToast('Select exactly one row to edit.', 'warning'); return; }
          openForm('Edit', rows[0]); return;
        }

        if (action === 'view') {
          const rows = selectedRows();
          if (rows.length !== 1) { showToast('Select exactly one row to view.', 'warning'); return; }
          openView(rows[0]); return;
        }

        if (action === 'copy') {
          const rows = selectedRows();
          if (rows.length !== 1) { showToast('Select exactly one row to copy.', 'warning'); return; }
          const clone = {};
          config.formFields.forEach(f => { clone[f.key] = rows[0][f.key] ?? ''; });
          if ('item_code' in clone) clone.item_code = String(clone.item_code) + '-COPY';
          const result = await apiFetch(config.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clone) });
          if (result) { showToast('Record copied successfully', 'success'); await load(); }
          return;
        }

        if (action === 'delete') {
          const rows = selectedRows();
          if (rows.length !== 1) { showToast('Select exactly one row to delete.', 'warning'); return; }
          openModal('Confirm Delete', `<p style="margin:8px 0">Are you sure you want to delete this record?<br><strong style="color:#dc2626">This action cannot be undone.</strong></p>`,
            async () => {
              const result = await apiFetch(`${config.endpoint}/${rows[0].id}`, { method: 'DELETE' });
              if (result) { showToast('Record deleted', 'success'); state.selected.delete(rows[0].id); closeModal(); await load(); }
            });
          return;
        }

        if (action === 'reports') { showToast('Reports feature coming soon.', 'info'); }
      });
    });

    /* ── Pagination ───────────────────────────────── */
    document.getElementById('prev-page').addEventListener('click', () => {
      if (state.page > 1) { state.page--; renderTable(); }
    });
    document.getElementById('next-page').addEventListener('click', () => {
      const maxPage = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
      if (state.page < maxPage) { state.page++; renderTable(); }
    });
    document.getElementById('page-size-sel').addEventListener('change', e => {
      state.pageSize = Number(e.target.value);
      state.page = 1;
      renderTable();
    });

    await load();
  }

  /* ── Router ───────────────────────────────────────── */
  if (pageKey === 'dashboard') { renderDashboard(); return; }
  if (pageKey === 'shopfloorConsole') { renderShopfloorConsole(); return; }
  const config = MODULES[pageKey];
  if (config) { renderAdminPage(config); return; }
  const productConfig = PRODUCT_CONFIG_MODULES[pageKey];
  if (productConfig) { renderProductConfigPage(productConfig); return; }
  const uploadConfig = UPLOAD_MODULES[pageKey];
  if (uploadConfig) { renderUploadPage(uploadConfig); return; }

  // Fallback
  document.getElementById('app').innerHTML = shell(`<div class="breadcrumb">Home</div><h1 class="page-title">${SHORT_PRODUCT_NAME}</h1><p class="page-subtitle">${PRODUCT_SUBTITLE}</p>`);
  renderSidebar();
})();
