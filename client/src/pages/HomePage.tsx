import React from 'react';
import FeaturedSection from '../components/FeaturedSection';
import PopularProducts from '../components/PopularProduct';
import { useLatestProductsQuery } from '../redux/api/product.api';
import Banner from '../components/common/Banner';
import CustomerReviews from '../components/common/CustomerReviews';

const HomePage: React.FC = () => {
    const { data: productData, isLoading: productLoading, isError: productError } = useLatestProductsQuery('');

    const products = productData?.products || [];

    if (productLoading) {
        return <p className="text-center mt-10 text-lg text-blue-500">Loading...</p>;
    }

    if (productError) {
        return <div className="flex items-center justify-center min-h-[80vh] text-lg text-red-500">Error loading products.</div>;
    }

    if (products.length === 0) {
        return <div className="text-center min-h-[80%] text-lg text-yellow-500">No products available.</div>;
    }

    return (
        <div className='min-h-screen flex flex-col items-center'>

            <FeaturedSection />

            <PopularProducts products={products} />

            <Banner />

            <CustomerReviews />
        </div>
    );
};

export default HomePage;
