import React, { useState, useCallback, ReactNode } from 'react';
import { TableState, ColumnDef, RowData, CellData, TableContextType } from './types';
import { TableContext } from './context';

interface TableProviderProps {
  children: ReactNode;
  initialColumns?: ColumnDef[];
  initialData?: RowData[];
}

export const TableProvider: React.FC<TableProviderProps> = ({
  children
}) => {
  const [activeCell, setActiveCellState] = useState<{ rowId: string; colId: string } | null>(null);
  const [editingCell, setEditingCellState] = useState<{ rowId: string; colId: string } | null>(null);

  const setActiveCell = useCallback((rowId: string, colId: string) => {
    setActiveCellState({ rowId, colId });
  }, []);

  const startEditingCell = useCallback((rowId: string, colId: string) => {
    setEditingCellState({ rowId, colId });
    setActiveCellState({ rowId, colId });
  }, []);

  const stopEditingCell = useCallback(() => {
    setEditingCellState(null);
  }, []);

  const contextValue = {
    state: {
      activeCell,
      editingCell
    } as Partial<TableState>,
    setActiveCell,
    startEditingCell,
    stopEditingCell
  };

  return (
    <TableContext.Provider value={contextValue as TableContextType}>
      {children}
    </TableContext.Provider>
  );
};

// useTable hook moved to hooks.ts
