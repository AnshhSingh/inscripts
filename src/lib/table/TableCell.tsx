import React, { useState, useRef, useEffect } from 'react';
import { useTable } from './hooks';

interface TableCellProps {
  rowId: string;
  colId: string;
  value: unknown;
  isActive?: boolean;
  isEditing?: boolean;
  type?: 'text' | 'number' | 'date' | 'url' | 'custom';
  rowType?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onChange?: (value: unknown) => void;
  onTypeChange?: (newType: 'text' | 'number' | 'date' | 'url' | 'custom') => void;
  customRenderer?: (props: { value: unknown, rowId: string, colId: string }) => React.ReactNode;
  showControls?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  rowId,
  colId,
  value,
  isActive = false,
  isEditing = false,
  type = 'text',
  rowType,
  textAlign = 'left',
  className = '',
  style = {},
  onClick,
  onChange,
  onTypeChange,
  customRenderer,
  showControls = false
}) => {
  const [editValue, setEditValue] = useState(String(value || ''));
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  // State to force rerender when needed for URL cells
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Update local state when the value prop changes
  useEffect(() => {
    setEditValue(String(value || ''));
  }, [value]);

  // Special handling for URL type to ensure proper rendering
  useEffect(() => {
    // Force rerender when type is URL to ensure proper display
    if (type === 'url' && value) {
      setForceUpdate(prev => prev + 1);
    }
  }, [type, value, isActive, isEditing]);
  
  // Force rerender when value changes to ensure UI reflects latest data
  useEffect(() => {
    if (value !== undefined) {
      setForceUpdate(prev => prev + 1);
    }
  }, [value, type]); // Also trigger rerender when type changes

  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Use a small timeout to ensure the DOM has updated before focusing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Select all text for easier editing on single-click
          inputRef.current.select();
          // Position cursor at the end for better user experience when continuing to type
          const length = inputRef.current.value.length;
          if (length > 0) {
            try {
              inputRef.current.setSelectionRange(0, length);
            } catch (e) {
              // Fallback if setSelectionRange is not supported
              inputRef.current.select();
            }
          }
        }
      }, 10);
    }
  }, [isEditing]);

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



  const { stopEditingCell } = useTable();
  
  const handleBlur = () => {
    // Only stop editing on blur, we've already been updating the value as user types
    stopEditingCell();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // We've already been updating the value as the user types,
      // so we just need to stop editing
      stopEditingCell();
    } else if (e.key === 'Escape') {
      // Revert to original value on Escape
      setEditValue(String(value || ''));
      stopEditingCell();
      if (onChange) {
        onChange(value); // Restore the original value
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
      // Let the table component handle arrow keys and Tab for navigation
      e.stopPropagation();
      // Don't prevent default so that text cursor can still be moved within the input
      if (e.key === 'Tab') {
        e.preventDefault(); // Prevent tab from moving focus away from the input
        // Apply the current value before navigating with Tab
        if (onChange) {
          onChange(editValue);
        }
      }
    }
  };

  const handleTypeChange = (newType: 'text' | 'number' | 'date' | 'url' | 'custom') => {
    if (onTypeChange) {
      onTypeChange(newType);
    }
    setShowTypeMenu(false);
  };

  // Style based on alignment
  const alignClass = textAlign === 'right' 
    ? 'text-right' 
    : textAlign === 'center' 
      ? 'text-center' 
      : 'text-left';

  // Custom renderer
  if (customRenderer) {
    return (
      <div
        onClick={onClick}
        className={`justify-center items-center flex min-h-8 w-full overflow-hidden text-xs font-normal leading-none h-8 bg-white px-2 border-b border-gray-200 ${className} ${isActive ? 'ring-2 ring-blue-400 z-10 bg-blue-50' : 'hover:bg-gray-50'} cursor-cell`}
        style={style}
      >
        {customRenderer({ value, rowId, colId })}
      </div>
    );
  }

  // Default cell type (text, number, date, url)

  // Default cell type (text, number, date, url)
  return (
    <div
      data-rowid={rowId}
      data-colid={colId}
      onClick={onClick}
      className={`relative justify-center items-center flex min-h-8 w-full overflow-hidden text-xs font-normal leading-none h-8 bg-white px-2 border-b border-gray-200 ${alignClass} ${className} ${isActive ? 'ring-2 ring-blue-400 z-10 bg-blue-50' : 'hover:bg-gray-50'} cursor-cell`}
      style={style}
    >
      {isEditing ? (        <input
          ref={inputRef}
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          value={editValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setEditValue(newValue);
            // Update the value immediately as the user types
            if (onChange) {
              onChange(newValue);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full text-[#121212] px-0 py-0 border-none bg-transparent outline-none"
          style={{ minWidth: '100%' }}
          autoFocus
          // When first clicked, select all text for easy replacement
          onFocus={(e) => e.target.select()}
        />
      ) : (
        <div 
          className={`text-[#121212] w-full overflow-hidden text-ellipsis whitespace-nowrap ${type === 'url' ? 'text-blue-600 underline' : ''}`} 
          title={value ? String(value) : ''}
          key={`cell-content-${String(value || '')}-${forceUpdate}`} // Key to force rerender when value changes
        >
          {(() => {
            if (!value) return "\u00A0"; // Use non-breaking space to maintain height if empty
            
            // Format based on cell type
            switch(type) {
              case 'date':
                try {
                  // Type guard for value that can be used as Date constructor parameter
                  if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleDateString();
                    }
                  }
                  return String(value);
                } catch (e) {
                  return String(value);
                }
              case 'url': {
                // Create a function to safely open the URL in a new tab
                const openUrl = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (value && typeof value === 'string') {
                    try {
                      window.open(value, '_blank', 'noopener,noreferrer');
                    } catch (err) {
                      console.error('Failed to open URL:', err);
                    }
                  }
                };
                
                // Type guard for string URLs
                const urlString = typeof value === 'string' ? value : String(value);
                
                // Render as an anchor with proper styling and click handling
                return (
                  <div className="relative w-full overflow-hidden">
                    <a 
                      href={urlString} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={openUrl}
                      className="text-blue-600 underline block w-full overflow-hidden text-ellipsis whitespace-nowrap absolute inset-0"
                      key={`url-${urlString}-${forceUpdate}`} // Key helps force remounting
                      title={urlString} // Show full URL on hover
                    >
                      {urlString}
                    </a>
                    {/* Invisible text to maintain layout */}
                    <span className="invisible">{urlString}</span>
                  </div>
                );
              }
              default: {
                return String(value);
              }
            }
          })()}
        </div>
      )}
    </div>
  );
};
