import React from 'react';

// Define the props for the SearchBar component
interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onSearch: () => void;
}

// Define the SearchBar component
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
    return (
        <div className="flex items-center mb-4">
            {/* Input field for search term */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="flex-grow px-4 py-2 border rounded-l-md"
            />
            {/* Button to trigger search */}
            <button
                onClick={onSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
