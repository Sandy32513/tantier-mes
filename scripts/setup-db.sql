CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_no VARCHAR(50),
  first_name VARCHAR(100),
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  org_role VARCHAR(100),
  extension VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS system_configurations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_name VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS organizational_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  org_structure VARCHAR(150) NOT NULL,
  reports_to VARCHAR(150) DEFAULT '',
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  mother_customer VARCHAR(150) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS custom_tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  date_from DATE,
  date_to DATE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS control_numbers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(150) NOT NULL,
  format VARCHAR(150) NOT NULL,
  counter INT NOT NULL,
  alphanumeric_counter VARCHAR(50) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS item_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50),
  description VARCHAR(200),
  remarks VARCHAR(200),
  is_immutable BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS item_subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_category VARCHAR(100),
  code VARCHAR(100),
  description VARCHAR(200),
  type VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_category VARCHAR(100),
  item_subcategory VARCHAR(100),
  item_code VARCHAR(100),
  description VARCHAR(255),
  alias VARCHAR(100),
  item_source VARCHAR(100),
  uom VARCHAR(50),
  track_by VARCHAR(50),
  is_sold BOOLEAN DEFAULT FALSE,
  has_virtual_bom BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS factories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  code VARCHAR(50),
  is_default BOOLEAN DEFAULT FALSE,
  is_immutable BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  code VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS skillsets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tool_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  item_subcategory VARCHAR(100),
  tool_group_item_code VARCHAR(100),
  track_by VARCHAR(50),
  tool_life INT,
  calibration_trigger VARCHAR(100),
  tool_group_description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_group VARCHAR(150),
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  uom VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  tracking_number VARCHAR(100),
  date_acquired DATE,
  last_calibration_date DATE,
  remaining_tool_life INT
);

CREATE TABLE IF NOT EXISTS equipment_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  item_subcategory VARCHAR(100),
  equipment_group_code VARCHAR(100),
  equipment_group_description VARCHAR(255),
  setup_time DECIMAL(10,2),
  cost_per_hour DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_group VARCHAR(150),
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  serial_no VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  tracking_number VARCHAR(100),
  production_line VARCHAR(150),
  efficiency_percentage DECIMAL(5,2),
  effectivity_date DATE,
  maximum_component_limit INT
);

CREATE TABLE IF NOT EXISTS processes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  process_type VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS production_lines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  factory VARCHAR(150),
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS manufacturing_routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  revision_number INT NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft',
  is_default BOOLEAN DEFAULT FALSE,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bill_of_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_code VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  revision_number INT NOT NULL DEFAULT 0,
  remarks VARCHAR(255) DEFAULT '',
  state VARCHAR(50) NOT NULL DEFAULT 'Draft',
  is_default BOOLEAN DEFAULT FALSE,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_code VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  revision_number INT NOT NULL DEFAULT 0,
  state VARCHAR(50) NOT NULL DEFAULT 'Draft',
  is_default BOOLEAN DEFAULT FALSE,
  effectivity_start_date DATE NULL,
  effectivity_end_date DATE NULL,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS common_product_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  revision_number INT NOT NULL DEFAULT 0,
  state VARCHAR(50) NOT NULL DEFAULT 'Draft',
  is_default BOOLEAN DEFAULT FALSE,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packing_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(100) NOT NULL,
  dimension VARCHAR(150) DEFAULT '',
  is_ng_packing BOOLEAN DEFAULT FALSE,
  revision_number INT NOT NULL DEFAULT 0,
  state VARCHAR(50) NOT NULL DEFAULT 'Draft',
  is_default BOOLEAN DEFAULT FALSE,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
