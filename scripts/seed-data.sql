INSERT INTO modules (module_name)
SELECT 'Planning' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules);

INSERT INTO modules (module_name)
SELECT 'Execution' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='Execution');

INSERT INTO modules (module_name)
SELECT 'WIP' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='WIP');

INSERT INTO modules (module_name)
SELECT 'SPC' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='SPC');

INSERT INTO modules (module_name)
SELECT 'DCC' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='DCC');

INSERT INTO modules (module_name)
SELECT 'IIoT' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='IIoT');

INSERT INTO modules (module_name)
SELECT 'CMMS' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='CMMS');

INSERT INTO modules (module_name)
SELECT 'RMS' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='RMS');

INSERT INTO modules (module_name)
SELECT 'OEE' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='OEE');

INSERT INTO modules (module_name)
SELECT 'Inventory' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE module_name='Inventory');
