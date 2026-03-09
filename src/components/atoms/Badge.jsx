import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'inline-block px-3 py-1 rounded-full text-sm font-medium';

  const variants = {
    default: 'bg-gray-100 text-text-dark',
    primary: 'bg-primary bg-opacity-10 text-primary',
    accent: 'bg-accent bg-opacity-10 text-accent',
    success: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
