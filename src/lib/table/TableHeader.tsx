import React, { useState, useRef, useEffect } from 'react';
import { ColumnDef } from './types';
import { TextIcon, NumberIcon, DateIcon, UrlIcon, CustomIcon, ChevronDownIcon } from '../icons';

interface TableHeaderProps {
  column: ColumnDef;
  className?: string;
  onSort?: () => void;
  onResize?: (columnId: string, width: string) => void;
  onTitleChange?: (title: string) => void;
  onTypeChange?: (columnId: string, type: 'text' | 'number' | 'date' | 'url' | 'custom') => void;
  onColorChange?: (columnId: string, color: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  column,
  className = '',
  onSort,
  onResize,
  onTitleChange,
  onTypeChange,
  onColorChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [customColor, setCustomColor] = useState(column.headerColor || '');
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Close type menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTypeMenu && typeMenuRef.current && !typeMenuRef.current.contains(event.target as Node)) {
        setShowTypeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTypeMenu]);
  
  // Close color menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorMenu && colorMenuRef.current && !colorMenuRef.current.contains(event.target as Node)) {
        setShowColorMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorMenu]);
  
  // Column resizing functionality
  useEffect(() => {
    if (!onResize) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const parentElement = headerRef.current?.parentElement;
      if (!parentElement) return;
      
      e.preventDefault();
      
      const width = Math.max(32, startWidth + e.clientX - startX);
      
      // Set inline style for immediate visual feedback
      parentElement.style.width = `${width}px`;
      parentElement.style.minWidth = `${width}px`;
    };

    const handleMouseUp = () => {
      if (!isResizing) return;
      
      setIsResizing(false);
      
      const parentElement = headerRef.current?.parentElement;
      if (!parentElement || !onResize) return;
      
      // Calculate the current width after drag ends
      const width = parentElement.offsetWidth;
      
      // Use tailwind classes for width
      const tailwindWidth = `min-w-[${width}px] w-[${width}px]`;
      onResize(column.id, tailwindWidth);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize, startX, startWidth, column.id]);

  const handleDoubleClick = () => {
    if (onTitleChange) {
      setIsEditing(true);
    } else {
      console.log(`Double-clicked column title: ${column.title} (editing not enabled)`);
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
      console.log(`Changed column ${column.title} type to: ${type}`);
    } else {
      console.log(`Type change requested for column ${column.title}: ${type} (handler not enabled)`);
    }
    setShowTypeMenu(false);
    setTimeout(() => {
      document.body.focus();
    }, 0);
  };

  const handleHeaderColorChange = (color: string) => {
    if (onColorChange) {
      onColorChange(column.id, color);
      console.log(`Changed column ${column.title} color to: ${color}`);
    } else {
      console.log(`Color change requested for column ${column.title}: ${color} (handler not enabled)`);
    }
    setShowColorMenu(false);
  };

  // Column type icon based on the current type
  const renderTypeIcon = () => {
    const type = column.type || 'text';
    switch(type) {
      case 'number':
        return <NumberIcon title="Number Column" className="w-5 h-5" />;
      case 'date':
        return <DateIcon title="Date Column" className="w-5 h-5" />;
      case 'url':
        return <UrlIcon title="URL Column" className="w-5 h-5" />;
      case 'custom':
        return <CustomIcon title="Custom Column" className="w-5 h-5" />;
      default:
        return <TextIcon title="Text Column" className="w-5 h-5" />;
    }
  };

  // Use custom header renderer if provided
  if (column.headerRenderer) {
    return column.headerRenderer({ column });
  }

  return (
    <div 
      ref={headerRef}
      className={`relative items-center flex h-8 w-full border-b border-gray-200 px-1 ${className} ${column.headerClass || ''}`}
      style={{ 
        ...column.headerStyle,
        backgroundColor: column.headerColor || '#EEE'
      }}
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
              onClick={() => {
                if (onSort) {
                  onSort();
                } else {
                  console.log(`Sort clicked for column: ${column.title}`);
                }
              }}
              title="Sort column"
              className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0L7.5 6H0.5L4 0Z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Column resize handle */}
      {onResize && (
        <div 
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            setStartX(e.clientX);
            const parentElement = headerRef.current?.parentElement;
            if (parentElement) {
              setStartWidth(parentElement.offsetWidth);
            }
          }}
        >
          <div className="w-1 h-full group-hover:bg-blue-400 group-hover:w-1.5 transition-all absolute right-0 opacity-0 group-hover:opacity-100" />
        </div>
      )}          {/* Column Type Control - Always visible */}
      {/* Color Picker Control */}
      {onColorChange && !isEditing && (
        <div 
          className="absolute right-8 top-1 text-gray-400 hover:text-gray-600 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="p-1 text-xs rounded hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowColorMenu(!showColorMenu);
            }}
            title="Change header color"
            style={{
              backgroundColor: column.headerColor || '#EEEEEE',
              width: '20px',
              height: '20px',
              border: '1px solid #ccc'
            }}
          />

          {showColorMenu && (
            <div
              ref={colorMenuRef}
              className="absolute right-0 top-6 bg-white border border-gray-200 rounded shadow-lg p-2 z-30"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()} 
            >
              <div className="text-xs font-semibold mb-1">Header Color</div>
              <div className="grid grid-cols-5 gap-1">
                {[
                  '#EEEEEE', '#FFE4E1', '#E6F3FF', '#E8F5E9', '#FFF3E0',
                  '#F5E6FF', '#FFEBEE', '#E0F7FA', '#F3E5F5', '#FFF8E1'
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:border-gray-400"
                    style={{ backgroundColor: color }}
                    onClick={() => handleHeaderColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Type Control */}
      {onTypeChange && !isEditing && (
        <div 
          className="absolute right-1 top-1 text-gray-400 hover:text-gray-600 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="p-1 text-xs rounded hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
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
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()} 
            >
              <div className="text-xs font-semibold mb-1 px-2">Column Type</div>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTypeChange('text');
                }}
                type="button"
              >
                T - Text Column
              </button>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTypeChange('number');
                }}
                type="button"
              >
                # - Number Column
              </button>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTypeChange('date');
                }}
                type="button"
              >
                📅 - Date Column
              </button>
              <button 
                className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTypeChange('url');
                }}
                type="button"
              >
                🔗 - URL Column
              </button>
            </div>
          )}
        </div>
      )}

      {/* Column Color Control - Always visible */}
      {onColorChange && !isEditing && (
        <div 
          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="p-0.5 text-xs rounded hover:bg-gray-100 relative group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowColorMenu(!showColorMenu);
            }}
            title="Change header color"
          >
            <div 
              className="w-4 h-4 rounded border border-gray-300 shadow-sm group-hover:border-gray-400 transition-colors" 
              style={{ backgroundColor: column.headerColor || '#f3f4f6' }} 
            />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {column.headerColor || '#f3f4f6'}
            </span>
          </button>

          {showColorMenu && (
            <div
              ref={colorMenuRef}
              className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-30 w-56"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()} 
            >
              <div className="text-sm font-semibold mb-2">Column Color</div>
              
              {/* Color Presets */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Presets</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA',
                    '#FFE4E1', '#E6F3FF', '#E8F5E9', '#FFF3E0', '#F5E6FF',
                    '#FFEBEE', '#E0F7FA', '#F3E5F5', '#FFF8E1', '#FAFAFA'
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded hover:scale-110 transition-transform relative group"
                      style={{ 
                        backgroundColor: color,
                        border: '1px solid #e5e7eb',
                      }}
                      onClick={() => handleHeaderColorChange(color)}
                    >
                      {column.headerColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <div className="text-xs text-gray-500 mb-1">Custom Hex Color</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customColor || ''}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value)) {
                        handleHeaderColorChange(e.target.value);
                      }
                    }}
                    placeholder="#FFFFFF"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    pattern="^#[A-Fa-f0-9]{6}$"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (/^#([A-Fa-f0-9]{6})$/.test(customColor || '')) {
                        handleHeaderColorChange(customColor!);
                      }
                    }}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    disabled={!/^#([A-Fa-f0-9]{6})$/.test(customColor || '')}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
