import React, { useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { TableState, ColumnDef, RowData, CellData } from './types';

interface TableContextType {
  state: TableState;
  setCellValue: (rowId: string, colId: string, value: any) => void;
  addColumn: () => void;
  addRow: () => void;
  setActiveCell: (rowId: string, colId: string) => void;
  startEditingCell: (rowId: string, colId: string) => void;
  stopEditingCell: () => void;
  getColumnLetter: (index: number) => string;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

interface TableProviderProps {
  children: ReactNode;
  initialColumns?: ColumnDef[];
  initialData?: RowData[];
}

export const TableProvider: React.FC<TableProviderProps> = ({
  children,
  initialColumns = [],
  initialData = []
}) => {
  const [state, setState] = useState<TableState>({
    columns: initialColumns,
    data: initialData,
    activeCell: null,
    selectedCells: [],
    editingCell: null
  });

  // Set cell value
  const setCellValue = useCallback((rowId: string, colId: string, value: any) => {
    setState(prevState => {
      // Find the row and column
      const rowIndex = prevState.data.findIndex(row => row.id === rowId);
      const colIndex = prevState.columns.findIndex(col => col.id === colId);
      
      if (rowIndex === -1 || colIndex === -1) return prevState;
      
    
      const newData = [...prevState.data];
      const row = { ...newData[rowIndex] };
      

      if (!row.cells) {
        row.cells = {};
      }
      
    
      row.cells = {
        ...row.cells,
        [colId]: { id: `cell-${colId}-${rowId}`, value }
      };
      
    
      const accessorKey = prevState.columns[colIndex].accessorKey;
      if (accessorKey) {
        row[accessorKey] = value;
      }
      

      newData[rowIndex] = row;
      
      return {
        ...prevState,
        data: newData
      };
    });
  }, []);


  const getColumnLetter = useCallback((index: number) => {
    let columnName = '';
    let dividend = index + 1; //cause no one wants to start at 0
    let modulo;

    while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }
    
    return columnName;
  }, []);

  
  const addColumn = useCallback(() => {
    setState(prevState => {
      const columnId = `col-${prevState.columns.length + 1}`;
      const newColumn: ColumnDef = {
        id: columnId,
        title: getColumnLetter(prevState.columns.length),
        width: 'min-w-32 w-32',
        type: 'text'
      };
      
      return {
        ...prevState,
        columns: [...prevState.columns, newColumn]
      };
    });
  }, [getColumnLetter]);

 
  const addRow = useCallback(() => {
    setState(prevState => {
      const rowId = `row-${prevState.data.length + 1}`;
      const cells: Record<string, CellData> = {};
      
     
      prevState.columns.forEach(column => {
        cells[column.id] = { 
          id: `cell-${column.id}-${rowId}`,
          value: null
        };
      });
      
      const newRow: RowData = {
        id: rowId,
        cells
      };
      
      return {
        ...prevState,
        data: [...prevState.data, newRow]
      };
    });
  }, []);

  const setActiveCell = useCallback((rowId: string, colId: string) => {
    setState(prevState => ({
      ...prevState,
      activeCell: { rowId, colId }
    }));
  }, []);

  // Start editing cell
  const startEditingCell = useCallback((rowId: string, colId: string) => {
    setState(prevState => ({
      ...prevState,
      editingCell: { rowId, colId },
      activeCell: { rowId, colId }
    }));
  }, []);

  // Stop editing cell
  const stopEditingCell = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      editingCell: null
    }));
  }, []);

  const contextValue: TableContextType = {
    state,
    setCellValue,
    addColumn,
    addRow,
    setActiveCell,
    startEditingCell,
    stopEditingCell,
    getColumnLetter
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  
  return context;
};
