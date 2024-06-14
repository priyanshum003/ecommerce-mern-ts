import React from 'react';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({ products }) => {
  return (
    // Container for the popular products
    <section className="container mx-auto my-8 p-4">
      {/* Header section with title and link to view all products */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Popular Products</h2>
        <Link to="/products" className="text-blue-900 font-semibold">
          View all products
        </Link>
      </div>
      {/* Grid for displaying products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {/* Map through the products and display each one using ProductCard component */}
        {products.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
