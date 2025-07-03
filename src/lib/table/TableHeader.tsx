import React, { useState, useRef, useEffect } from 'react';
import { ColumnDef } from './types';

interface TableHeaderProps {
  column: ColumnDef;
  className?: string;
  onSort?: () => void;
  onResize?: (width: number) => void;
  onTitleChange?: (title: string) => void;
  onTypeChange?: (columnId: string, type: 'text' | 'number' | 'date' | 'url' | 'custom') => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  column,
  className = '',
  onSort,
  onResize,
  onTitleChange,
  onTypeChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
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

  const handleDoubleClick = () => {
    if (onTitleChange) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (editedTitle.trim() && onTitleChange) {
      onTitleChange(editedTitle);
    } else {
      setEditedTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editedTitle.trim() && onTitleChange) {
        onTitleChange(editedTitle);
      } else {
        setEditedTitle(column.title);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditedTitle(column.title);
      setIsEditing(false);
    }
  };

  const handleTypeChange = (type: 'text' | 'number' | 'date' | 'url' | 'custom') => {
    if (onTypeChange) {
      onTypeChange(column.id, type);
      setShowTypeMenu(false);
    }
  };

  // Column type icon based on the current type
  const renderTypeIcon = () => {
    const type = column.type || 'text';
    switch(type) {
      case 'number':
        return <span title="Number Column" className="w-5 h-5 flex items-center justify-center">#</span>;
      case 'date':
        return <span title="Date Column" className="w-5 h-5 flex items-center justify-center">📅</span>;
      case 'url':
        return <span title="URL Column" className="w-5 h-5 flex items-center justify-center">🔗</span>;
      case 'custom':
        return <span title="Custom Column" className="w-5 h-5 flex items-center justify-center">✨</span>;
      default:
        return <span title="Text Column" className="w-5 h-5 flex items-center justify-center">T</span>;
    }
  };

  // Use custom header renderer if provided
  if (column.headerRenderer) {
    return column.headerRenderer({ column });
  }

  return (
    <div 
      className={`relative items-center flex h-8 w-full bg-[#EEE] border-b border-gray-200 px-1 ${className} ${column.headerClass || ''}`}
      style={column.headerStyle}
    >
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-[#757575] text-xs w-full text-center outline-none border border-blue-400 rounded"
          autoFocus
        />
      ) : (
        <div 
          className={`text-[#757575] text-xs font-medium w-full text-center ${onTitleChange ? 'cursor-text' : ''}`}
          onDoubleClick={handleDoubleClick}
        >
          {column.headerIcon && (
            <img 
              src={column.headerIcon} 
              alt={`${column.title} icon`} 
              className="w-4 h-4 inline-block mr-1"
            />
          )}
          {column.title}
          {column.isSortable && (
            <button 
              onClick={onSort} 
              className="ml-1 opacity-50 hover:opacity-100"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0L7.5 6H0.5L4 0Z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Column Type Control - Always visible */}
      {onTypeChange && !isEditing && (
        <div className="absolute right-1 top-1 text-gray-400 hover:text-gray-600 z-20">
          <button
            type="button"
            className="p-1 text-xs rounded hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setShowTypeMenu(!showTypeMenu);
            }}
            title="Change column type"
          >
            {renderTypeIcon()}
          </button>

          {showTypeMenu && (
            <div
              ref={typeMenuRef}
              className="absolute right-0 top-6 bg-white border border-gray-200 rounded shadow-lg p-1 z-30 w-32"
            >
              <div className="text-xs font-semibold mb-1 px-2">Column Type</div>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onClick={() => handleTypeChange('text')}
              >
                T - Text Column
              </button>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onClick={() => handleTypeChange('number')}
              >
                # - Number Column
              </button>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onClick={() => handleTypeChange('date')}
              >
                📅 - Date Column
              </button>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onClick={() => handleTypeChange('url')}
              >
                🔗 - URL Column
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
