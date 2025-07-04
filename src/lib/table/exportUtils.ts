import * as XLSX from 'xlsx';
import { ColumnDef, RowData } from './types';

/**
 * Export table data to Excel file
 * @param columns Column definitions
 * @param rows Row data
 * @param fileName Optional file name (default: 'spreadsheet.xlsx')
 */
export const exportToExcel = (
  columns: ColumnDef[],
  rows: RowData[],
  fileName: string = 'spreadsheet.xlsx'
): void => {
  // Create worksheet data
  const worksheetData = rows.map(row => {
    const rowData: Record<string, unknown> = {};
    
    // For each column, get the cell value if it exists
    columns.forEach(column => {
      const cell = row.cells?.[column.id];
      // Convert unknown type to string for export if it's not a primitive type
      const value = cell?.value;
      rowData[column.title] = (value != null && typeof value !== 'object') ? value : '';
    });
    
    return rowData;
  });

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, fileName);
};
