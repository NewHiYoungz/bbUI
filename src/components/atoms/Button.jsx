import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'px-6 py-3 rounded-custom font-medium transition-all duration-200 active:scale-95';

  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
    accent: 'bg-accent text-white hover:opacity-90',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabled ? disabledClasses : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
