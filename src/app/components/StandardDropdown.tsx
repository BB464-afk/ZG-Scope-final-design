import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface StandardDropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  mode?: 'single' | 'multi';
  disabled?: boolean;
  className?: string;
  error?: string;
  style?: React.CSSProperties;
  onOpenChange?: (isOpen: boolean) => void;
  forceDirection?: 'bottom' | 'top'; // Force dropdown direction instead of auto-calculating
  maxHeight?: number; // Custom max height for dropdown list
}

export default function StandardDropdown({
  options,
  value,
  onChange,
  placeholder = 'Search and select...',
  mode = 'single',
  disabled = false,
  className = '',
  error = '',
  style = {},
  onOpenChange,
  forceDirection,
  maxHeight = 280
}: StandardDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure options is always an array
  const safeOptions = options || [];

  // Notify parent when open state changes
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Calculate dropdown position based on available space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      
      // Store position for fixed positioning
      setMenuPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });

      // If forceDirection is set, use it instead of calculating
      if (forceDirection) {
        setDropdownPosition(forceDirection);
        return;
      }

      const dropdownHeight = maxHeight; // maxHeight of dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Open upward if not enough space below but enough space above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
        setMenuPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width
        });
      } else {
        setDropdownPosition('bottom');
        setMenuPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    }
  }, [isOpen, forceDirection, maxHeight]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search query
  const filteredOptions = safeOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected values as array
  const selectedValues = mode === 'multi' 
    ? (Array.isArray(value) ? value : [])
    : (value ? [value as string] : []);

  // Get selected options for display
  const selectedOptions = safeOptions.filter(opt => selectedValues.includes(opt.value));

  const handleOptionClick = (optionValue: string) => {
    if (mode === 'single') {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    } else {
      // Multi-select mode
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    }
  };

  const isSelected = (optionValue: string) => {
    return selectedValues.includes(optionValue);
  };

  const handleFieldClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Display text for single select
  const displayText = mode === 'single' && selectedOptions.length > 0 
    ? selectedOptions[0].label 
    : '';

  return (
    <div ref={dropdownRef} className={className} style={{ position: 'relative', width: '100%', ...style }}>
      {/* Dropdown Field */}
      <div
        onClick={handleFieldClick}
        style={{
          height: '40px',
          padding: '0 40px 0 12px',
          border: `1px solid ${error ? '#DC2626' : '#D8DEE8'}`,
          borderRadius: '4px',
          backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          outline: 'none'
        }}
      >
        {/* Search Icon */}
        <Search 
          size={16} 
          style={{ 
            color: '#6B7280',
            flexShrink: 0
          }} 
        />

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : displayText}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            color: '#272721',
            cursor: disabled ? 'not-allowed' : 'text'
          }}
        />

        {/* Dropdown Arrow Icon */}
        <ChevronDown
          size={16}
          style={{
            color: '#6B7280',
            position: 'absolute',
            right: '12px',
            transition: 'transform 200ms',
            ...(isOpen && { transform: 'rotate(180deg)' }),
            pointerEvents: 'none',
            flexShrink: 0
          }}
        />
      </div>

      {/* Dropdown List Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: dropdownPosition === 'bottom' ? `${menuPosition.top + 4}px` : `${menuPosition.top - maxHeight - 4}px`,
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`,
            maxHeight: `${maxHeight}px`,
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 10000,
            overflowY: 'auto',
            padding: '4px'
          }}
        >
          {filteredOptions.length === 0 ? (
            <div style={{
              padding: '16px',
              textAlign: 'center',
              color: '#9CA3AF',
              fontSize: '13px'
            }}>
              No results found
            </div>
          ) : (
            filteredOptions.map(option => {
              const selected = isSelected(option.value);
              
              return (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: selected ? 'rgba(228, 238, 254, 0.5)' : 'transparent',
                    transition: 'background-color 150ms'
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {/* Checkbox for multi-select */}
                  {mode === 'multi' && (
                    <input
                      type="checkbox"
                      checked={selected}
                      readOnly
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        accentColor: '#FD4314'
                      }}
                    />
                  )}

                  {/* Option Label */}
                  <span style={{
                    fontSize: '14px',
                    color: '#272721',
                    flex: 1
                  }}>
                    {option.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Multi-Select: Show Selected Items as Chips Below Dropdown */}
      {mode === 'multi' && selectedOptions.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '8px'
        }}>
          {selectedOptions.map(opt => (
            <div
              key={opt.value}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: '#E4EEFE',
                border: '1px solid #FD4314',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721'
              }}
            >
              <span>{opt.label}</span>
              <X
                size={14}
                style={{ 
                  cursor: 'pointer', 
                  color: '#FD4314',
                  flexShrink: 0
                }}
                onClick={() => handleOptionClick(opt.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          fontSize: '12px',
          color: '#DC2626',
          marginTop: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}