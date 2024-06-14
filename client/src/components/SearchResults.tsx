import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/api-types';

// Define the props for the SearchResults component
interface SearchResultsProps {
  products: Product[];
}

// Define the SearchResults component
const SearchResults: React.FC<SearchResultsProps> = ({ products }) => {
  return (
    // Container for search results
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Map through the products and display each one */}
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg p-4 flex flex-col justify-between h-full">
          {/* Product Image */}
          <img src={product.photo} alt={product.name} className="w-full h-48 object-cover rounded-md" />
          {/* Product Name */}
          <h3 className="text-xl font-bold mt-4">{product.name}</h3>
          {/* Product Price */}
          <p className="text-lg font-semibold text-gray-800">${(product.price / 100).toFixed(2)}</p>
          {/* View Details Button */}
          <Link to={`/product/${product._id}`} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg text-center">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
