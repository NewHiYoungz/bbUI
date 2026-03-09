import React from 'react';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 rounded-custom border-2 border-text-secondary focus:border-primary focus:outline-none transition-colors duration-200';

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${icon ? 'pl-12' : ''} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
