import React, { useState, useRef, useEffect } from 'react';
import { RowData, ColumnDef } from './types';

interface TableRowProps {
  row: RowData;
  columns: ColumnDef[];
  isActive?: boolean;
  onClick?: (rowId: string) => void;
  className?: string;
  renderCell: (columnId: string, rowId: string) => React.ReactNode;
  onRowTypeChange?: (rowId: string, type: 'text' | 'number' | 'date' | 'url' | 'custom') => void;
  showRowControls?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  isActive = false,
  onClick,
  className = '',
  renderCell,
  onRowTypeChange,
  showRowControls = false
}) => {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  
  // Close type menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target as Node)) {
        setShowTypeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTypeChange = (type: 'text' | 'number' | 'date' | 'url' | 'custom') => {
    if (onRowTypeChange) {
      onRowTypeChange(row.id, type);
    }
    setShowTypeMenu(false);
  };


  const renderTypeIcon = () => {
    const type = row.type || 'text';
    switch(type) {
      case 'number':
        return <span title="Number Row">#</span>;
      case 'date':
        return <span title="Date Row">📅</span>;
      case 'url':
        return <span title="URL Row">🔗</span>;
      case 'custom':
        return <span title="Custom Row">✨</span>;
      default:
        return <span title="Text Row">T</span>;
    }
  };
  
  return (
    <div 
      className={`flex ${className} ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      onClick={() => onClick?.(row.id)}
    >
      {columns.map((column) => (
        <div 
          key={`cell-${row.id}-${column.id}`}
          className={`${column.width || 'min-w-32 w-32'}`}
        >
          {renderCell(column.id, row.id)}
        </div>
      ))}
    </div>
  );
};
