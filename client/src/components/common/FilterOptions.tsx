import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import icons from react-icons/fa

interface FilterOptionsProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    minPrice: number | undefined;
    setMinPrice: (price: number) => void;
    maxPrice: number | undefined;
    setMaxPrice: (price: number) => void;
    sort: 'asc' | 'desc' | 'relevance';
    setSort: (sort: 'asc' | 'desc' | 'relevance') => void;
    clearFilters: () => void;
}

// Functional component for filter options
const FilterOptions: React.FC<FilterOptionsProps> = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sort,
    setSort,
    clearFilters,
}) => {
    // State to toggle the visibility of categories
    const [showCategories, setShowCategories] = useState(true);

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Sort options */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sort</label>
                <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'asc' | 'desc' | 'relevance')}
                >
                    <option value="relevance">Relevance</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>
            {/* Category filter */}
            <div className="mb-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCategories(!showCategories)}>
                    <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                    {showCategories ? <FaChevronUp className="h-5 w-5 text-gray-500" /> : <FaChevronDown className="h-5 w-5 text-gray-500" />}
                </div>
                {showCategories && (
                    <ul className="mt-2 space-y-1">
                        {categories.map((category) => (
                            <li
                                key={category}
                                className={`cursor-pointer px-3 py-2 rounded-md ${
                                    selectedCategory === category
                                        ? 'bg-indigo-500 text-white'
                                        : 'hover:bg-gray-200'
                                }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Price filter */}
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Price</h3>
                <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2 items-center">
                        <label className="w-1/2 text-sm font-medium text-gray-700">Starting Range</label>
                        <input
                            type="number"
                            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            placeholder="Min Price"
                            value={minPrice || ''}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                        />
                    </div>
                    <div className="flex space-x-2 items-center">
                        <label className="w-1/2 text-sm font-medium text-gray-700">Ending Range</label>
                        <input
                            type="number"
                            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            placeholder="Max Price"
                            value={maxPrice || ''}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            {/* Clear filters button */}
            <button
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                onClick={clearFilters}
            >
                Clear Filters
            </button>
        </div>
    );
};

export default FilterOptions;
