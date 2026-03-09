import React from 'react';
import { Input } from '../atoms';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search APIs...', className = '' }) => {
  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<FiSearch size={20} />}
        className="text-lg"
      />
    </div>
  );
};

export default SearchBar;
