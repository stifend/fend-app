// ========================================
// 📋 DROPDOWN COMPONENT
// ========================================
// Komponen dropdown reusable untuk select menu
//
// PROPS:
// - options: array of { value, label, disabled }
// - value: string
// - onChange: function
// - placeholder: string
// - label: string
// - error: string
// - disabled: boolean
//
// CONTOH PENGGUNAAN:
// import { Dropdown } from './components';
// const options = [
//   { value: 'option1', label: 'Option 1' },
//   { value: 'option2', label: 'Option 2' }
// ];
// <Dropdown options={options} value={selected} onChange={setSelected} label="Pilih Status" />
// ========================================

import { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Pilih opsi',
  label,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown saat click di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle option select
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  // Cari label dari value yang dipilih
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`dropdown-component ${className}`.trim()} ref={dropdownRef} {...props}>
      {/* Label (opsional) */}
      {label && <label className="dropdown-label">{label}</label>}
      
      {/* Dropdown Button */}
      <button
        type="button"
        className={`dropdown-button ${isOpen ? 'dropdown-open' : ''} ${error ? 'dropdown-error' : ''} ${disabled ? 'dropdown-disabled' : ''}`.trim()}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={`dropdown-text ${!selectedOption ? 'dropdown-placeholder' : ''}`.trim()}>
          {displayText}
        </span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'dropdown-arrow-up' : ''}`.trim()} 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="dropdown-menu">
          {options.length === 0 ? (
            <div className="dropdown-empty">Tidak ada opsi</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-item ${value === option.value ? 'dropdown-item-selected' : ''}`.trim()}
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
      
      {/* Error Message */}
      {error && <span className="dropdown-error-message">{error}</span>}
    </div>
  );
};

export default Dropdown;

// Contoh penggunaan:
// const options = [
//   { value: 'option1', label: 'Option 1' },
//   { value: 'option2', label: 'Option 2' },
//   { value: 'option3', label: 'Option 3', disabled: true }
// ];
// <Dropdown options={options} value={selected} onChange={setSelected} label="Pilih Status" />
