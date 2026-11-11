import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface SearchableDropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  disabled = false 
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          height: '40px',
          padding: '0 12px',
          fontSize: '14px',
          border: isOpen ? '1px solid #FD4314' : '1px solid #D1D5DB',
          borderRadius: '4px',
          backgroundColor: disabled ? '#F9FAFB' : '#FFFFFF',
          color: selectedOption ? '#272721' : '#9CA3AF',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          outline: 'none'
        }}
      >
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} style={{ 
          flexShrink: 0, 
          marginLeft: '8px',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 150ms ease'
        }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          border: '1px solid #D1D5DB',
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 100,
          maxHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search Input */}
          <div style={{
            padding: '8px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '10px',
                color: '#9CA3AF'
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '0 12px 0 36px',
                  fontSize: '13px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Options List */}
          <div style={{
            overflowY: 'auto',
            maxHeight: '220px'
          }}>
            {filteredOptions.length === 0 ? (
              <div style={{
                padding: '12px 16px',
                fontSize: '13px',
                color: '#9CA3AF',
                textAlign: 'center'
              }}>
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: '#272721',
                    cursor: 'pointer',
                    backgroundColor: value === option.value ? '#F4F8FD' : 'transparent',
                    borderLeft: value === option.value ? '3px solid #FD4314' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}