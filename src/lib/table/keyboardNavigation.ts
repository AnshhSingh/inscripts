//will use this in future


import { TableState } from './types';
import { RowData, ColumnDef } from './types';

export interface KeyboardNavigationProps {
  state: TableState;
  data: RowData[];
  columns: ColumnDef[];
  enableEditing: boolean;
  enableSelection: boolean;
  setActiveCell: (rowId: string, colId: string) => void;
  startEditingCell: (rowId: string, colId: string) => void;
  stopEditingCell: () => void;
}

export const useKeyboardNavigation = ({
  state,
  data,
  columns,
  enableEditing,
  enableSelection,
  setActiveCell,
  startEditingCell,
  stopEditingCell,
}: KeyboardNavigationProps) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!state.activeCell) return;
    const { rowId, colId } = state.activeCell;
    const rowIndex = data.findIndex((row) => row.id === rowId);
    const colIndex = columns.findIndex((col) => col.id === colId);
    if (rowIndex === -1 || colIndex === -1) return;
    
    if (e.key === "ArrowUp") {
      e.preventDefault();
      // Stop editing the current cell (changes are already saved)
      if (state.editingCell) stopEditingCell();
      // Move to the cell above
      const nextRowId = data[(rowIndex - 1 + data.length) % data.length].id;
      setActiveCell(nextRowId, colId);
      // Make the new cell editable
      if (enableEditing) startEditingCell(nextRowId, colId);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Stop editing the current cell (changes are already saved)
      if (state.editingCell) stopEditingCell();
      // Move to the cell below
      const nextRowId = data[(rowIndex + 1) % data.length].id;
      setActiveCell(nextRowId, colId);
      // Make the new cell editable
      if (enableEditing) startEditingCell(nextRowId, colId);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      // Stop editing the current cell (changes are already saved)
      if (state.editingCell) stopEditingCell();
      // Move to the cell to the left
      const nextColId =
        columns[(colIndex - 1 + columns.length) % columns.length].id;
      setActiveCell(rowId, nextColId);
      // Make the new cell editable
      if (enableEditing) startEditingCell(rowId, nextColId);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      // Stop editing the current cell (changes are already saved)
      if (state.editingCell) stopEditingCell();
      // Move to the cell to the right
      const nextColId = columns[(colIndex + 1) % columns.length].id;
      setActiveCell(rowId, nextColId);
      // Make the new cell editable
      if (enableEditing) startEditingCell(rowId, nextColId);
    } else if (e.key === "Tab") {
      e.preventDefault();
      // First stop editing if currently editing
      if (state.editingCell) stopEditingCell();

      let nextRowId: string, nextColId: string;

      if (e.shiftKey) {
        // Shift+Tab moves backwards
        if (colIndex === 0 && rowIndex === 0) {
          // If at the first cell, wrap around to the last cell
          nextRowId = data[data.length - 1].id;
          nextColId = columns[columns.length - 1].id;
        } else if (colIndex === 0) {
          // If at the first column, go to the last column of the previous row
          nextRowId = data[(rowIndex - 1 + data.length) % data.length].id;
          nextColId = columns[columns.length - 1].id;
        } else {
          // Otherwise, just move one column left
          nextRowId = rowId;
          nextColId =
            columns[(colIndex - 1 + columns.length) % columns.length].id;
        }
      } else {
        // Tab moves forwards
        if (colIndex === columns.length - 1 && rowIndex === data.length - 1) {
          // If at the last cell, wrap around to the first cell
          nextRowId = data[0].id;
          nextColId = columns[0].id;
        } else if (colIndex === columns.length - 1) {
          nextRowId = data[(rowIndex + 1) % data.length].id;
          nextColId = columns[0].id;
        } else {
          nextRowId = rowId;
          nextColId = columns[(colIndex + 1) % columns.length].id;
        }
      }

      setActiveCell(nextRowId, nextColId);
      if (enableEditing) startEditingCell(nextRowId, nextColId);
    } else if (e.key === "Enter" && enableEditing) {
      if (state.editingCell) {
        stopEditingCell();
        const nextRowId = data[(rowIndex + 1) % data.length].id;
        setActiveCell(nextRowId, colId);
        startEditingCell(nextRowId, colId);
      } else {
        startEditingCell(rowId, colId);
      }
    } else if (e.key === "Escape" && state.editingCell) {
      stopEditingCell();
    } else if (
      !state.editingCell &&
      enableEditing &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      startEditingCell(rowId, colId);
    }
  };

  const attachKeyboardListeners = (tableElement: HTMLElement | null) => {
    if (!tableElement) return () => {};
    
    tableElement.addEventListener("keydown", handleKeyDown);
    
    return () => {
      tableElement.removeEventListener("keydown", handleKeyDown);
    };
  };

  return {
    attachKeyboardListeners
  };
};
