import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ placeholder = 'Search...', onSearch, className }) => {
  const [q, setQ] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(q);
  };
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};
export default SearchBar;
