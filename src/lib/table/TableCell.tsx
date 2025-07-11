import React, { useState, useRef, useEffect } from 'react';
import { useTable } from './hooks';
import { StatusType } from './types';

// Status colors for different status values
const STATUS_COLORS = {
  'not-set': '#EEEEEE',
  'in-process': '#FFF3C2',
  'need-to-start': '#E6F3FF',
  'complete': '#E0F7E6',
  'blocked': '#FFE1DE'
};

// Status text colors (darker versions of the background colors)
const STATUS_TEXT_COLORS = {
  'not-set': '#777777',
  'in-process': '#8A7E00',
  'need-to-start': '#0056B3',
  'complete': '#1B7740',
  'blocked': '#B53F36'
};

// Status labels for display
const STATUS_LABELS = {
  'not-set': 'Not set',
  'in-process': 'In-process',
  'need-to-start': 'Need to start',
  'complete': 'Complete',
  'blocked': 'Blocked'
};

interface TableCellProps {
  rowId: string;
  colId: string;
  value: unknown;
  isActive?: boolean;
  isEditing?: boolean;
  type?: 'text' | 'number' | 'date' | 'url' | 'status' | 'custom';
  rowType?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onChange?: (value: unknown) => void;
  onTypeChange?: (newType: 'text' | 'number' | 'date' | 'url' | 'status' | 'custom') => void;
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
  const [editValue, setEditValue] = useState(type === 'status' ? (value ? String(value) : '') : String(value || ''));
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  // State to force rerender when needed for URL cells
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Update local state when the value prop changes
  useEffect(() => {
    if (type === 'status') {
      // For status type, keep empty value as empty string rather than 'undefined' or 'null'
      setEditValue(value ? String(value) : '');
    } else {
      setEditValue(String(value || ''));
    }
  }, [value, type]);

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
    if (!isEditing) return;
    
    // Use a small timeout to ensure the DOM has updated before focusing
    setTimeout(() => {
      if (type === 'status' && selectRef.current) {
        selectRef.current.focus();
      } else if (inputRef.current) {
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
  }, [isEditing, type]);

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

  const handleTypeChange = (newType: 'text' | 'number' | 'date' | 'url' | 'status' | 'custom') => {
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

  // Render status cell content
  const renderStatusValue = () => {
    if (!value) {
      // Return empty content for initial state
      return null;
    }
    
    const statusValue = (typeof value === 'string' ? value : 'not-set') as StatusType;
    const statusColor = STATUS_COLORS[statusValue] || STATUS_COLORS['not-set'];
    const statusLabel = STATUS_LABELS[statusValue] || 'Not set';
    const textColor = STATUS_TEXT_COLORS[statusValue] || STATUS_TEXT_COLORS['not-set'];
    
    return (
      <div className="flex justify-center">
        <div 
          className="px-3 py-1 rounded-full text-center text-xs"
          style={{ backgroundColor: statusColor, color: textColor }}
        >
          {statusLabel}
        </div>
      </div>
    );
  };

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

  return (
    <div
      data-rowid={rowId}
      data-colid={colId}
      onClick={onClick}
      className={`relative justify-center items-center flex min-h-8 w-full overflow-hidden text-xs font-normal leading-none h-8 bg-white px-2 border-b border-gray-200 ${type === 'status' ? 'py-0.5' : ''} ${alignClass} ${className} ${isActive ? 'ring-2 ring-blue-400 z-10 bg-blue-50' : 'hover:bg-gray-50'} cursor-cell`}
      style={style}
    >
      {isEditing ? (
        type === 'status' ? (
          <div className="w-full flex justify-center">
            <div className="relative w-32">
              <select
                ref={selectRef}
                value={editValue || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setEditValue(newValue);
                  if (onChange) {
                    onChange(newValue === '' ? null : newValue);
                  }
                }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-1 border border-gray-300 rounded-full text-center text-xs appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
                style={{
                  backgroundColor: editValue ? STATUS_COLORS[editValue as StatusType] : 'white',
                  color: editValue ? STATUS_TEXT_COLORS[editValue as StatusType] : '#121212',
                }}
                autoFocus
              >
                <option value="" style={{ backgroundColor: 'white', color: '#121212' }}>Select status</option>
                <option value="not-set" style={{ backgroundColor: STATUS_COLORS['not-set'], color: STATUS_TEXT_COLORS['not-set'] }}>Not set</option>
                <option value="in-process" style={{ backgroundColor: STATUS_COLORS['in-process'], color: STATUS_TEXT_COLORS['in-process'] }}>In-process</option>
                <option value="need-to-start" style={{ backgroundColor: STATUS_COLORS['need-to-start'], color: STATUS_TEXT_COLORS['need-to-start'] }}>Need to start</option>
                <option value="complete" style={{ backgroundColor: STATUS_COLORS['complete'], color: STATUS_TEXT_COLORS['complete'] }}>Complete</option>
                <option value="blocked" style={{ backgroundColor: STATUS_COLORS['blocked'], color: STATUS_TEXT_COLORS['blocked'] }}>Blocked</option>
              </select>
              <div className="absolute right-2 top-0 bottom-0 pointer-events-none flex items-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <input
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
            onFocus={(e) => e.target.select()}
          />
        )
      ) : (
        <div 
          className={`text-[#121212] w-full overflow-hidden text-ellipsis whitespace-nowrap ${type === 'url' ? 'text-blue-600 underline' : ''}`} 
          title={value ? String(value) : ''}
          key={`cell-content-${String(value || '')}-${forceUpdate}`} // Key to force rerender when value changes
        >
          {(() => {
            // For empty cells (except status which we handle specially)
            if (!value) {
              if (type === 'status') {
                return renderStatusValue(); // Will return null for empty status
              }
              return "\u00A0"; // Use non-breaking space to maintain height for other empty cells
            }
            
            // Format based on cell type
            switch(type) {
              case 'status':
                return renderStatusValue();
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
