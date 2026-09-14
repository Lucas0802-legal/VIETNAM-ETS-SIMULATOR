export type CsvCell = string | number | boolean | null | undefined;

const guardSpreadsheetFormula = (value: string): string =>
  /^[=+\-@]/.test(value) ? `'${value}` : value;

export const escapeCsvCell = (cell: CsvCell): string => {
  const raw = typeof cell === 'string'
    ? guardSpreadsheetFormula(cell)
    : cell === null || cell === undefined
      ? ''
      : String(cell);
  return `"${raw.replace(/"/g, '""')}"`;
};

export const buildCsv = (rows: CsvCell[][]): string =>
  `\uFEFF${rows.map(row => row.map(escapeCsvCell).join(',')).join('\r\n')}`;

export const downloadCsv = (filename: string, rows: CsvCell[][]): void => {
  const blob = new Blob([buildCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
