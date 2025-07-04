import React, { useState, useCallback, useEffect, useRef } from "react";
import { TableProps, RowData, ColumnDef, CellData } from "./types";
import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";
import { useTable } from "./hooks";

//main component for rendering a simple table its not reallythat simple ig
export const SimpleTable: React.FC<TableProps> = ({
  columns,
  data,
  onCellChange,
  onColumnTitleChange,
  onColumnTypeChange,
  onColumnResize,
  onRowAdd,
  onColumnAdd,
  onHeaderColorChange,
  showRowNumbers = true,
  enableEditing = true,
  enableSelection = true,
  enableSorting = false,
  enableResizing = true, // Enable resizing by default
  enableFiltering = false,
  className = "",
  style = {},
  headerClassName = "",
  cellClassName = "",
  rowClassName = "",
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const { state, setActiveCell, startEditingCell, stopEditingCell } =
    useTable();

 
  const handleHeaderColorChange = useCallback(
    (columnId: string, color: string) => {
      if (!onHeaderColorChange) return;
      onHeaderColorChange(columnId, color);
    },
    [onHeaderColorChange]
  );


  const handleCellClick = useCallback(
    (rowId: string, colId: string, e: React.MouseEvent) => {
      if (!enableSelection) return;
      setActiveCell(rowId, colId);

      if (enableEditing) {
        startEditingCell(rowId, colId);
      }
    },
    [enableSelection, enableEditing, setActiveCell, startEditingCell]
  );

  const handleCellChange = useCallback(
    (rowId: string, colId: string, value: unknown) => {
      const column = columns.find((col) => col.id === colId);
      const isUrlColumn = column?.type === "url";
      let processedValue = value;
      if (
        isUrlColumn &&
        value &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        if (!/^https?:\/\//i.test(value)) {
          processedValue = `https://${value}`;
        }
      }
      if (onCellChange) {
        
        onCellChange(rowId, colId, processedValue);
      }

 
    },
    [onCellChange, columns]
  );

  const handleColumnTypeChange = useCallback(
    (columnId: string, type: "text" | "number" | "date" | "url" | "custom") => {
      if (onColumnTypeChange) {
       
        onColumnTypeChange(columnId, type);


        setTimeout(() => {
          const element = document.querySelector(
            `[data-colid="${columnId}"]`
          ) as HTMLElement | null;
          if (element) {
      
            const currentDisplay = element.style.display;
            element.style.display = "none";
            setTimeout(() => {
              element.style.display = currentDisplay;
            }, 0);
          }
        }, 0);
      }
    },
    [onColumnTypeChange]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!enableSelection) return;
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
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (tableElement) {
        tableElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [
    state.activeCell,
    state.editingCell,
    data,
    columns,
    enableSelection,
    enableEditing,
    setActiveCell,
    startEditingCell,
    stopEditingCell,
  ]);

  // Scroll active cell into view
  useEffect(() => {
    if (!state.activeCell) return;
    const { rowId, colId } = state.activeCell;
    const cell = document.querySelector(
      `[data-rowid="${rowId}"][data-colid="${colId}"]`
    );
    if (cell && "scrollIntoView" in cell) {
      (cell as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [state.activeCell]);

  return (
    <div className={`simple-table-container ${className}`} style={style}>
      <div
        ref={tableRef}
        className="simple-table items-stretch flex w-fit bg-white border-collapse"
        tabIndex={0}
        style={{ minWidth: "100%" }}
      >
        {showRowNumbers && (
          <div className="w-8 sticky left-0 z-10 bg-gray-100 border-r border-gray-200 shadow-sm">
            {/* Header cell */}
            <div className="flex items-center justify-center h-8 bg-[#EEE] border-b border-gray-200">
              <div className="text-xs text-gray-500">#</div>
            </div>

            {/* Row number cells */}
            {data.map((row) => (
              <div
                key={`row-num-${row.id}`}
                className="flex items-center justify-center h-8 bg-white text-xs text-gray-500 hover:bg-gray-50 border-b border-gray-200"
              >
                {row.id.toString().replace(/[^0-9]/g, "")}
              </div>
            ))}
          </div>
        )}
        =
        <div className="relative flex min-w-60 items-stretch h-full">
          ]
          {columns.map((column) => (
            <div
              key={`col-${column.id}`}
              className={`${
                column.width || "min-w-32 w-32"
              } border-r border-gray-200 transition-width duration-100`}
            >
              <TableHeader
                column={column}
                className={headerClassName}
                onTitleChange={
                  onColumnTitleChange
                    ? (title) => onColumnTitleChange(column.id, title)
                    : undefined
                }
                onTypeChange={
                  onColumnTypeChange
                    ? (columnId, type) => handleColumnTypeChange(columnId, type)
                    : undefined
                }
                onResize={
                  enableResizing && onColumnResize
                    ? (columnId, width) => onColumnResize(columnId, width)
                    : undefined
                }
                onColorChange={handleHeaderColorChange}
              />
              =
              {data.map((row) => {
                const cellValue = column.accessorKey
                  ? row[column.accessorKey]
                  : row.cells?.[column.id]?.value;

                const isActive =
                  state.activeCell?.rowId === row.id &&
                  state.activeCell?.colId === column.id;

                const isEditing =
                  state.editingCell?.rowId === row.id &&
                  state.editingCell?.colId === column.id;

                return (
                  <TableCell
                    key={`cell-${row.id}-${column.id}`}
                    rowId={row.id}
                    colId={column.id}
                    value={cellValue}
                    isActive={isActive}
                    isEditing={isEditing && enableEditing}
                    type={column.type || "text"}
                    rowType={row.type}
                    textAlign={column.textAlign || "left"}
                    className={`${cellClassName} ${column.cellClass || ""}`}
                    style={column.cellStyle}
                    onClick={(e) => handleCellClick(row.id, column.id, e)}
                    onChange={(value) =>
                      handleCellChange(row.id, column.id, value)
                    }
                    customRenderer={column.cellRenderer}
                    data-rowid={row.id}
                    data-colid={column.id}
                  />
                );
              })}
            </div>
          ))}
          {onColumnAdd && (
            <div className="min-w-40 w-40 border-l border-r border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center h-8 border-b border-gray-200">
                <button
                  className="hover:bg-gray-100 transition-colors rounded-full p-1 w-6 h-6 flex items-center justify-center"
                  onClick={onColumnAdd}
                  title="Add column"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              <div className="bg-gray-50 h-full">
                {data.map((row) => (
                  <div
                    key={`add-col-${row.id}`}
                    className="h-8 border-b border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {onRowAdd && (
        <div className="sticky left-0 w-full flex gap-px p-2 justify-center bg-white border-t border-gray-200 shadow-sm">
          <button
            onClick={onRowAdd}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded flex items-center gap-2"
          >
            <span className="text-gray-700">Add Row</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
