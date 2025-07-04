import React, { useState, useEffect } from 'react';
import { 
  SimpleTable, 
  ColumnDef, 
  RowData, 
  TableProvider,
  exportToExcel,
  parseExcelFile
} from '@/lib/table';
import { defaultColumns, defaultRows } from '@/lib/table/defaultData';

interface ExcelSpreadsheetProps {
  searchTerm?: string;
}

interface ExcelSpreadsheetRef {
  handleExport: () => void;
  handleImport: (file: File) => Promise<void>;
}

const ExcelSpreadsheet = React.forwardRef<ExcelSpreadsheetRef, ExcelSpreadsheetProps>((props, ref) => {
  // Handle import from Excel
  const handleImport = async (file: File) => {
    try {
      const { columns: importedColumns, rows: importedRows } = await parseExcelFile(file);
      setColumns(importedColumns);
      setRows(importedRows);
    } catch (error) {
      console.error('Failed to import Excel file:', error);
      // You might want to add proper error handling here
    }
  };

  // Expose handleExport and handleImport through ref
  React.useImperativeHandle(ref, () => ({
    handleExport,
    handleImport
  }));

  // Search state
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);

  const [columns, setColumns] = useState<ColumnDef[]>(defaultColumns);
  const [rows, setRows] = useState<RowData[]>(defaultRows);

  // Initialize filteredRows with all rows
  useEffect(() => {
    if (!props.searchTerm) {
      setFilteredRows(rows);
      return;
    }

    const searchTermLower = props.searchTerm.toLowerCase();
    const filtered = rows.filter(row => {
      // Search in all cells of the row
      return Object.values(row.cells || {}).some(cell => {
        const cellValue = String(cell.value || '').toLowerCase();
        return cellValue.includes(searchTermLower);
      });
    });

    setFilteredRows(filtered);
  }, [props.searchTerm, rows]);

  // Handle header color changes
  const handleHeaderColorChange = (columnId: string, color: string) => {
    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            headerColor: color
          };
        }
        return column;
      });
    });
  };

  // Handle cell changes
  const handleCellChange = (rowId: string, colId: string, value: unknown) => {
    setRows(prevRows => {
      const rowIndex = prevRows.findIndex(row => row.id === rowId);
      if (rowIndex === -1) return prevRows;
      
      const updatedRow = { ...prevRows[rowIndex] };
      if (!updatedRow.cells) {
        updatedRow.cells = {};
      }
      
      updatedRow.cells = {
        ...updatedRow.cells,
        [colId]: {
          id: `cell-${colId}-${rowId}`,
          value
        }
      };
      
      const newRows = [...prevRows];
      newRows[rowIndex] = updatedRow;
      return newRows;
    });
  };

  // Handle column title changes
  const handleColumnTitleChange = (columnId: string, title: string) => {
    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            title
          };
        }
        return column;
      });
    });
  };

  // Handle column type changes
  const handleColumnTypeChange = (columnId: string, type: 'text' | 'number' | 'date' | 'url' | 'custom') => {
    // Update column type with immediate state update
    setColumns(prevColumns => {
      const newColumns = prevColumns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            type
          };
        }
        return column;
      });
      
      console.log(`Column ${columnId} type changed to ${type}`);
      return newColumns;
    });
    
  
    if (type === 'url') {
      setRows(prevRows => {
        const newRows = prevRows.map(row => {
          if (row.cells && row.cells[columnId] && row.cells[columnId].value) {
            const cellValue = String(row.cells[columnId].value);
            if (cellValue.trim() !== '' && !/^https?:\/\//i.test(cellValue)) {
              return {
                ...row,
                cells: {
                  ...row.cells,
                  [columnId]: {
                    ...row.cells[columnId],
                    value: `https://${cellValue}`
                  }
                }
              };
            }
          }
          return row;
        });
        
        return newRows;
      });
    }
    
    // Force a UI refresh after state updates
    setTimeout(() => {
      // Try to find the column headers and cells for this column
      const columnElements = document.querySelectorAll(`[data-colid="${columnId}"]`);
      columnElements.forEach(element => {
        // Add a temporary class to trigger a reflow
        if (element instanceof HTMLElement) {
          element.classList.add('animate-column-type-flash');
          setTimeout(() => {
            element.classList.remove('animate-column-type-flash');
          }, 500); // Match the animation duration
        }
      });
    }, 0);
  };

  // simple logic for generating column letters
  const getColumnLetter = (index: number) => {
    let columnName = '';
    let dividend = index + 1;
    let modulo;

    while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }
    
    return columnName;
  };

// for column resize
  const handleColumnResize = (columnId: string, width: string) => {
    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            width
          };
        }
        return column;
      });
    });
  };

  // Handle adding a new column
  const handleAddColumn = () => {
    const newColumnId = `col-${columns.length + 1}`;
    setColumns(prevColumns => [
      ...prevColumns,
      {
        id: newColumnId,
        title: getColumnLetter(prevColumns.length),
        width: 'min-w-40 w-40',
        type: 'text'
      }
    ]);
  };

  // Handle adding a new row
  const handleAddRow = () => {
    const newRowId = `row-${rows.length + 1}`;
    setRows(prevRows => [
      ...prevRows,
      {
        id: newRowId,
        cells: {}
      }
    ]);
  };

  // Handle export to Excel
  const handleExport = () => {
    // Format current date for the filename
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `spreadsheet_${dateString}.xlsx`;
    
    // Export data to Excel - use filtered rows if there's a search term, otherwise use all rows
    const dataToExport = props.searchTerm ? filteredRows : rows;
    exportToExcel(columns, dataToExport, fileName);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Spreadsheet Header */}
      <div className="flex items-center min-w-60 h-8 gap-2 overflow-hidden text-xs text-[#545454] font-normal leading-none bg-[#E2E2E2] px-2 py-1 border-b border-gray-200">
        <div className="items-center rounded self-stretch flex gap-1 bg-[#EEE] my-auto p-1">
          <img
            src="icons/spreadsheeticon.png"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
            alt="Spreadsheet icon"
          />
          <div className="text-[#545454] self-stretch my-auto">
            New Spreadsheet
          </div>
        </div>
        <img
          src="icons/externalicon.png"
          className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
          alt="External link"
        />
      </div>
      
      {/* Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <TableProvider initialColumns={columns} initialData={rows}>
          <SimpleTable
            columns={columns}
            data={props.searchTerm ? filteredRows : rows}
            onCellChange={handleCellChange}
            onColumnTitleChange={handleColumnTitleChange}
            onColumnTypeChange={handleColumnTypeChange}
            onHeaderColorChange={handleHeaderColorChange}
            onRowAdd={handleAddRow}
            onColumnAdd={handleAddColumn}
            onColumnResize={handleColumnResize}
            enableEditing={true}
            enableSelection={true}
            enableResizing={true}
          />
        </TableProvider>
      </div>
    </div>
  );
});

export default ExcelSpreadsheet;
