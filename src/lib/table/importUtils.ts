import * as XLSX from 'xlsx';
import { ColumnDef, RowData } from './types';

/**
 * Convert Excel column letter to index (A -> 0, B -> 1, etc.)
 */
const letterToIndex = (letter: string): number => {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result *= 26;
    result += letter.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
  }
  return result - 1;
};


const indexToLetter = (index: number): string => {
  let temp = index + 1;
  let letter = '';
  while (temp > 0) {
    const remainder = (temp - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    temp = Math.floor((temp - remainder) / 26);
  }
  return letter;
};

/**
 * Parse Excel file and return columns and rows in our format
 */
export const parseExcelFile = async (file: File): Promise<{
  columns: ColumnDef[];
  rows: RowData[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
        
        // Get column range
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const lastColumnIndex = range.e.c;
        
        // Create columns
        const columns: ColumnDef[] = [];
        for (let i = 0; i <= lastColumnIndex; i++) {
          const columnLetter = indexToLetter(i);
          columns.push({
            id: `col-${i + 1}`,
            title: columnLetter,
            width: 'min-w-32 w-32',
            type: 'text'
          });
        }
        
        // Create rows
        interface ExcelRow {
          [key: string]: string | number | boolean | null;
        }

        interface CellData {
          id: string;
          value: string | number | boolean | null;
        }

        const rows: RowData[] = jsonData.slice(1).map((row: ExcelRow, index) => {
          const cells: Record<string, CellData> = {};
          
          // Process each column in the row
          Object.entries(row).forEach(([colLetter, value]) => {
            const colIndex = letterToIndex(colLetter);
            const colId = `col-${colIndex + 1}`;
            
            cells[colId] = {
              id: `cell-${colId}-row-${index + 1}`,
              value: value
            };
          });
          
          return {
            id: `row-${index + 1}`,
            cells
          };
        });
        
        resolve({ columns, rows });
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};
