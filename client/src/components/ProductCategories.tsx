import React, { useEffect, useRef, useState } from 'react';
import { useCategoriesQuery } from '../redux/api/product.api';

const ProductCategories: React.FC = () => {
  // Fetch categories using a Redux API hook
  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useCategoriesQuery('');
  
  // Refs for category container and state for scroll control
  const categoryContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Effect to check and update scroll status
  useEffect(() => {
    const checkScroll = () => {
      if (categoryContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoryContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    checkScroll(); // Initial check
    categoryContainerRef.current?.addEventListener('scroll', checkScroll);

    return () => {
      categoryContainerRef.current?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  // Loading and error states
  if (categoryLoading) {
    return <p>Loading...</p>;
  }

  if (categoryError) {
    return <p >Error loading products or categories</p>;
  }

  // Extract categories from the API response
  const categories = categoryData?.categories || [];

  // Scroll handlers
  const scrollLeft = () => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (categoryContainerRef.current) {
      categoryContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto">
      <div className="flex items-center">
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          className={`text-gray-500 hover:text-gray-900 focus:outline-none ${!canScrollLeft && 'opacity-50 cursor-not-allowed'}`}
          disabled={!canScrollLeft}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Category Buttons */}
        <div className="flex space-x-4 mb-4 overflow-x-auto py-2 scrollbar-hide" ref={categoryContainerRef}>
          {categories.map((category) => (
            <button key={category} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full whitespace-nowrap hover:bg-blue-500 hover:text-white transition-colors">
              {category}
            </button>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={scrollRight}
          className={`text-gray-500 hover:text-gray-900 focus:outline-none ${!canScrollRight && 'opacity-50 cursor-not-allowed'}`}
          disabled={!canScrollRight}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default ProductCategories;
