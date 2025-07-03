import React, { useState, useEffect } from 'react';
import { 
  SimpleTable, 
  ColumnDef, 
  RowData, 
  TableProvider 
} from '@/lib/table';

const ExcelSpreadsheet: React.FC = () => {

  const [columns, setColumns] = useState<ColumnDef[]>([
    {
      id: 'col-1',
      title: 'A',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-2',
      title: 'B',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-3',
      title: 'C',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-4',
      title: 'D',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-5',
      title: 'E',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-6',
      title: 'F',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-7',
      title: 'G',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-8',
      title: 'H',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-9',
      title: 'I',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-10',
      title: 'J',
      width: 'min-w-32 w-32',
      type: 'text',
    },
    {
      id: 'col-11',
      title: 'K',
      width: 'min-w-32 w-32',
      type: 'text',
    }
  ]);
  
  const [rows, setRows] = useState<RowData[]>(() => 
    Array.from({ length: 20 }, (_, index) => ({
      id: `row-${index + 1}`,
      cells: {}
    }))
  );

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

  // Handle column type changes
  const handleColumnTypeChange = (columnId: string, type: 'text' | 'number' | 'date' | 'url' | 'custom') => {
    // Update column type
    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            type
          };
        }
        return column;
      });
    });
    
    // If changing to URL type, process existing values to ensure they have https://
    if (type === 'url') {
      setRows(prevRows => {
        return prevRows.map(row => {
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
      });
    }
  };

  // Handle column title changes
  const handleColumnTitleChange = (columnId: string, newTitle: string) => {
    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            title: newTitle
          };
        }
        return column;
      });
    });
  };

  // simple logic for generating column letters
  const handleAddColumn = () => {
    const newColumnId = `col-${columns.length + 1}`;
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

    setColumns(prevColumns => [
      ...prevColumns,
      {
        id: newColumnId,
        title: getColumnLetter(prevColumns.length),
        width: 'min-w-32 w-32',
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

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Spreadsheet Header */}
      <div className="flex items-center min-w-60 h-8 gap-2 overflow-hidden text-xs text-[#545454] font-normal leading-none bg-[#E2E2E2] px-2 py-1 border-b border-gray-200">
        <div className="items-center rounded self-stretch flex gap-1 bg-[#EEE] my-auto p-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/74062749cd139ea98092fe39d5f6b239e9939c6f?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
            alt="Spreadsheet icon"
          />
          <div className="text-[#545454] self-stretch my-auto">
            New Spreadsheet
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c100ca763ec4aff47165d43cd2b97ea5344b6eef?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
          alt="External link"
        />
      </div>
      
      {/* Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <TableProvider initialColumns={columns} initialData={rows}>
          <SimpleTable
            columns={columns}
            data={rows}
            onCellChange={handleCellChange}
            onColumnTitleChange={handleColumnTitleChange}
            onColumnTypeChange={handleColumnTypeChange}
            onRowAdd={handleAddRow}
            onColumnAdd={handleAddColumn}
            enableEditing={true}
            enableSelection={true}
          />
        </TableProvider>
      </div>
    </div>
  );
};

export default ExcelSpreadsheet;
