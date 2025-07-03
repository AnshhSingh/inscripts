import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TableProps, RowData, ColumnDef, CellData } from './types';
import { TableHeader } from './TableHeader';
import { TableCell } from './TableCell';
import { TableRow } from './TableRow';

//main component for rendering a simple table its not reallythat simple ig
export const SimpleTable: React.FC<TableProps> = ({
  columns,
  data,
  onCellChange,
  onColumnTitleChange,
  onColumnTypeChange,
  onRowAdd,
  onColumnAdd,
  showRowNumbers = true,
  enableEditing = true,
  enableSelection = true,
  enableSorting = false,
  enableResizing = false,
  enableFiltering = false,
  className = '',
  style = {},
  headerClassName = '',
  cellClassName = '',
  rowClassName = ''
}) => {
  const [tableState, setTableState] = useState({
    activeCell: null,
    selectedCells: [],
    editingCell: null,
    activeColumn: null
  });
  
  const tableRef = useRef<HTMLDivElement>(null);

  // Handle cell click
  const handleCellClick = useCallback((rowId: string, colId: string, e: React.MouseEvent) => {
    if (!enableSelection) return;

    // Get the column for the cell
    const column = columns.find(col => col.id === colId);
    
    setTableState(prev => ({
      ...prev,
      activeCell: { rowId, colId },
      activeColumn: colId
    }));

    // Double-click to edit
    if (enableEditing && e.detail === 2) {
      setTableState(prev => ({
        ...prev,
        editingCell: { rowId, colId },
        activeCell: { rowId, colId }
      }));
    }
  }, [enableSelection, enableEditing, columns]);

  const handleCellChange = useCallback((rowId: string, colId: string, value: unknown) => {
    // Find column to check if it's a URL type
    const column = columns.find(col => col.id === colId);
    const isUrlColumn = column?.type === 'url';
    
    // For URL columns, ensure the value has a protocol
    let processedValue = value;
    if (isUrlColumn && value && typeof value === 'string' && value.trim() !== '') {
      // If URL doesn't start with a protocol, add https://
      if (!/^https?:\/\//i.test(value)) {
        processedValue = `https://${value}`;
      }
    }
    
    if (onCellChange) {
      onCellChange(rowId, colId, processedValue);
    }

    // Short delay to ensure cell re-renders properly after editing ends
    setTimeout(() => {
      setTableState(prev => ({
        ...prev,
        editingCell: null
      }));
    }, 10);
  }, [onCellChange, columns]);

  const handleColumnTypeChange = useCallback((columnId: string, type: 'text' | 'number' | 'date' | 'url' | 'custom') => {
    if (onColumnTypeChange) {
      onColumnTypeChange(columnId, type);
    }
  }, [onColumnTypeChange]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!enableSelection) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tableState.activeCell) return;
      
      const { rowId, colId } = tableState.activeCell;
      const rowIndex = data.findIndex(row => row.id === rowId);
      const colIndex = columns.findIndex(col => col.id === colId);
      
      if (rowIndex === -1 || colIndex === -1) return;
      
      // Bonus task simple keyboard navigation
      if (e.key === 'ArrowUp' && rowIndex > 0) {
        e.preventDefault();
        setTableState(prev => ({
          ...prev,
          activeCell: { rowId: data[rowIndex - 1].id, colId },
          activeColumn: colId
        }));
      } else if (e.key === 'ArrowDown' && rowIndex < data.length - 1) {
        e.preventDefault();
        setTableState(prev => ({
          ...prev,
          activeCell: { rowId: data[rowIndex + 1].id, colId },
          activeColumn: colId
        }));
      } else if (e.key === 'ArrowLeft' && colIndex > 0) {
        e.preventDefault();
        setTableState(prev => ({
          ...prev,
          activeCell: { rowId, colId: columns[colIndex - 1].id }
        }));
      } else if (e.key === 'ArrowRight' && colIndex < columns.length - 1) {
        e.preventDefault();
        setTableState(prev => ({
          ...prev,
          activeCell: { rowId, colId: columns[colIndex + 1].id }
        }));
      } else if (e.key === 'Tab') {
        e.preventDefault();
        
        if (e.shiftKey) {
          
          if (colIndex > 0) {
            setTableState(prev => ({
              ...prev,
              activeCell: { rowId, colId: columns[colIndex - 1].id }
            }));
          } else if (rowIndex > 0) {
            setTableState(prev => ({
              ...prev,
              activeCell: { 
                rowId: data[rowIndex - 1].id, 
                colId: columns[columns.length - 1].id 
              },
              activeColumn: columns[columns.length - 1].id
            }));
          }
        } else {
          // Move forward
          if (colIndex < columns.length - 1) {
            setTableState(prev => ({
              ...prev,
              activeCell: { rowId, colId: columns[colIndex + 1].id }
            }));
          } else if (rowIndex < data.length - 1) {
            setTableState(prev => ({
              ...prev,
              activeCell: { 
                rowId: data[rowIndex + 1].id, 
                colId: columns[0].id 
              },
              activeColumn: columns[0].id
            }));
          }
        }
      } else if (e.key === 'Enter' && enableEditing) {
        if (tableState.editingCell) {
       
          setTableState(prev => ({
            ...prev,
            editingCell: null,
            activeCell: rowIndex < data.length - 1 
              ? { rowId: data[rowIndex + 1].id, colId }
              : { rowId, colId },
            activeColumn: colId
          }));
        } else {
         
          setTableState(prev => ({
            ...prev,
            editingCell: { rowId, colId }
          }));
        }
      } else if (e.key === 'Escape' && tableState.editingCell) {
  
        setTableState(prev => ({
          ...prev,
          editingCell: null,
          showRowTypeMenu: null
        }));
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [tableState.activeCell, tableState.editingCell, data, columns, enableSelection, enableEditing]);

  // Function to determine if a column is active
  const isColumnActive = (columnId: string) => {
    return tableState.activeColumn === columnId;
  };

  return (
    <div className={`simple-table-container ${className}`} style={style}>
      <div 
        ref={tableRef}
        className="simple-table items-stretch flex w-fit bg-white border-collapse"
        tabIndex={0}
        style={{ minWidth: '100%' }}
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
                {row.id.toString().replace(/[^0-9]/g, '')}
              </div>
            ))}
          </div>
        )}

        {/* Table content */}
        <div className="relative flex min-w-60 items-stretch h-full">
          {/* Column headers */}
          {columns.map((column) => (
            <div key={`col-${column.id}`} className={`${column.width || 'min-w-32 w-32'} border-r border-gray-200`}>
              <TableHeader 
                column={column} 
                className={headerClassName}
                onTitleChange={onColumnTitleChange ? (title) => onColumnTitleChange(column.id, title) : undefined}
                onTypeChange={onColumnTypeChange}
              />
              
              {/* Column cells */}
              {data.map((row) => {
                // Get cell value using accessorKey or directly from cells object
                const cellValue = column.accessorKey 
                  ? row[column.accessorKey] 
                  : row.cells?.[column.id]?.value;
                
                const isActive = tableState.activeCell?.rowId === row.id && 
                                tableState.activeCell?.colId === column.id;
                
                const isEditing = tableState.editingCell?.rowId === row.id && 
                                tableState.editingCell?.colId === column.id;
                
                return (
                  <TableCell
                    key={`cell-${row.id}-${column.id}`}
                    rowId={row.id}
                    colId={column.id}
                    value={cellValue}
                    isActive={isActive}
                    isEditing={isEditing && enableEditing}
                    type={column.type || 'text'}
                    rowType={row.type}
                    textAlign={column.textAlign || 'left'}
                    className={`${cellClassName} ${column.cellClass || ''}`}
                    style={column.cellStyle}
                    onClick={(e) => handleCellClick(row.id, column.id, e)}
                    onChange={(value) => handleCellChange(row.id, column.id, value)}
                    customRenderer={column.cellRenderer}
                  />
                );
              })}
            </div>
          ))}

          {/* Add Column button */}
          {onColumnAdd && (
            <div className="w-8 border-l border-r border-gray-200">
              <div className="flex items-center justify-center h-8 bg-gray-50 border-b border-gray-200">
                <button 
                  className="hover:bg-gray-100 transition-colors rounded-full p-1 w-6 h-6 flex items-center justify-center"
                  onClick={onColumnAdd}
                  title="Add column"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
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

      {/* Add Row button */}
      {onRowAdd && (
        <div className="sticky left-0 w-full flex gap-px p-2 justify-center bg-white border-t border-gray-200 shadow-sm">
          <button 
            onClick={onRowAdd}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded flex items-center gap-2"
          >
            <span className="text-gray-700">Add Row</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
