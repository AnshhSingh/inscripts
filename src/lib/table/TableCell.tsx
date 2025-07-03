import React, { useState, useRef, useEffect } from 'react';

interface TableCellProps {
  rowId: string;
  colId: string;
  value: any;
  isActive?: boolean;
  isEditing?: boolean;
  type?: 'text' | 'number' | 'date' | 'url' | 'custom';
  rowType?: any;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onChange?: (value: any) => void;
  onTypeChange?: (newType: 'text' | 'number' | 'date' | 'url' | 'custom') => void;
  customRenderer?: (props: { value: any, rowId: string, colId: string }) => React.ReactNode;
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
  
  // Update local state when the value prop changes or editing state changes
  useEffect(() => {
    if (isEditing && type === 'url' && value) {
      // For URL type, strip the protocol when editing for better UX
      const urlValue = String(value || '').replace(/^https?:\/\//, '');
      setEditValue(urlValue);
    } else {
      // For other types, just use the value as-is
      setEditValue(String(value || ''));
    }
  }, [value, isEditing, type]);

  // Special handling for URL type to ensure proper rendering
  useEffect(() => {
    // Force rerender when type is URL to ensure proper display
    if (type === 'url' && value) {
      setForceUpdate(prev => prev + 1);
    }
  }, [type, value, isActive, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Use a small timeout to ensure the DOM has updated before focusing not sure if this helps but ai told me to do this
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
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



  const handleBlur = () => {
    if (onChange) {
      // For URL type, make sure to add https:// if needed
      if (type === 'url' && editValue && editValue.trim() !== '' && !/^https?:\/\//i.test(editValue)) {
        onChange(`https://${editValue}`);
      } else {
        onChange(editValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (onChange) {
        // For URL type, make sure to add https:// if needed
        if (type === 'url' && editValue && editValue.trim() !== '' && !/^https?:\/\//i.test(editValue)) {
          onChange(`https://${editValue}`);
        } else {
          onChange(editValue);
        }
      }
    } else if (e.key === 'Escape') {
      if (type === 'url' && value) {
        // For URL, strip the protocol when showing in edit field
        setEditValue(String(value || '').replace(/^https?:\/\//, ''));
      } else {
        setEditValue(String(value || ''));
      }
      if (onChange) {
        onChange(value);
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
      onClick={onClick}
      className={`relative justify-center items-center flex min-h-8 w-full overflow-hidden text-xs font-normal leading-none h-8 bg-white px-2 border-b border-gray-200 ${alignClass} ${className} ${isActive ? 'ring-2 ring-blue-400 z-10 bg-blue-50' : 'hover:bg-gray-50'} cursor-cell`}
      style={style}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
            className="w-full h-full text-[#121212] px-0 py-0 border-none bg-transparent outline-none"
          style={{ minWidth: '100%' }}
          autoFocus
        />
      ) : (
        <div className={`text-[#121212] w-full overflow-hidden text-ellipsis whitespace-nowrap ${type === 'url' ? 'text-blue-600 underline' : ''}`}>
          {(() => {
            if (!value) return "\u00A0"; // Use non-breaking space to maintain height if empty
            
            // Format based on cell type
            switch(type) {
              case 'date':
                try {
                  const date = new Date(value);
                  if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString();
                  }
                  return value;
                } catch (e) {
                  return value;
                }
              case 'url':
                // Ensure we have a properly formatted URL with protocol
                const ensureProtocol = (url: string) => {
                  if (!url) return '';
                  return url.match(/^https?:\/\//i) ? url : `https://${url}`;
                };
                
                // Create a function to safely open the URL in a new tab
                const openUrl = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (value && typeof value === 'string') {
                    try {
                      const url = ensureProtocol(value);
                      window.open(url, '_blank', 'noopener,noreferrer');
                    } catch (err) {
                      console.error('Failed to open URL:', err);
                    }
                  }
                };
                
                const urlWithProtocol = ensureProtocol(String(value));
                
                // Render as an anchor with proper styling and click handling
                return (
                  <div className="relative w-full overflow-hidden">
                    <a 
                      href={urlWithProtocol} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={openUrl}
                      className="text-blue-600 underline block w-full overflow-hidden text-ellipsis whitespace-nowrap absolute inset-0"
                      key={`url-${urlWithProtocol}-${forceUpdate}-${isActive ? 'active' : 'inactive'}`} // Key helps force remounting
                    >
                      {value}
                    </a>
                    {/* Invisible text to maintain layout */}
                    <span className="invisible">{value}</span>
                  </div>
                );
              default:
                return value;
            }
          })()}
        </div>
      )}
    </div>
  );
};
