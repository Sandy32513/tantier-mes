const XLSX = require('xlsx');

function normalizeHeader(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[%()]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseSpreadsheet(fileBuffer, fieldDefinitions = []) {
  const workbook = XLSX.read(fileBuffer, {
    type: 'buffer',
    cellDates: true,
    raw: false
  });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('The uploaded file does not contain any worksheets.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const matrix = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
    blankrows: false
  });

  if (!matrix.length) {
    throw new Error('The uploaded file is empty.');
  }

  const headers = (matrix[0] || []).map((value) => String(value ?? '').trim());
  const normalizedHeaders = headers.map(normalizeHeader);

  const aliasMap = new Map();
  fieldDefinitions.forEach((field) => {
    const aliases = [field.label, field.key, ...(field.aliases || [])];
    aliases.forEach((alias) => aliasMap.set(normalizeHeader(alias), field.key));
  });

  const headerFieldKeys = normalizedHeaders.map((header) => aliasMap.get(header) || null);
  const missingHeaders = fieldDefinitions
    .filter((field) => {
      if (field.required === false) return false;
      const aliases = [field.label, field.key, ...(field.aliases || [])].map(normalizeHeader);
      return !normalizedHeaders.some((header) => aliases.includes(header));
    })
    .map((field) => field.label);

  const rows = matrix
    .slice(1)
    .filter((cells) => cells.some((cell) => String(cell ?? '').trim() !== ''))
    .map((cells, index) => {
      const values = {};
      headerFieldKeys.forEach((fieldKey, columnIndex) => {
        if (fieldKey) {
          values[fieldKey] = cells[columnIndex];
        }
      });

      return {
        rowNumber: index + 2,
        values
      };
    });

  return {
    headers,
    rows,
    missingHeaders
  };
}

module.exports = {
  normalizeHeader,
  parseSpreadsheet
};
