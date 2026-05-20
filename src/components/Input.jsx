// ========================================
// 📝 INPUT COMPONENT
// ========================================
// Komponen input field reusable dengan label dan error message
//
// PROPS:
// - label: string
// - type: 'text' | 'email' | 'password' | 'tel' | 'date' | dll
// - name: string
// - value: string
// - onChange: function
// - placeholder: string
// - error: string
// - required: boolean
// - disabled: boolean
//
// CONTOH PENGGUNAAN:
// import { Input } from './components';
// <Input label="Email" type="email" name="email" value={email} onChange={handleChange} required />
// <Input label="Password" type="password" error="Password salah" />
// ========================================

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-component ${className}`.trim()}>
      {/* Label (opsional) */}
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      {/* Input Field */}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`.trim()}
        {...props}
      />
      
      {/* Error Message */}
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;

// Contoh penggunaan:
// <Input label="Email" type="email" name="email" value={email} onChange={handleChange} required />
// <Input label="Password" type="password" error="Password salah" />
