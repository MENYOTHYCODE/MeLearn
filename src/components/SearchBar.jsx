import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, onSearch, placeholder = 'Search...' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-12 "
      />
      <FiSearch className="absolute p-2 left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-1 px-4"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
