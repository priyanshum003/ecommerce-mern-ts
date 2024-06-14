import React from 'react';
import FeaturedSection from '../components/FeaturedSection';
import PopularProducts from '../components/PopularProduct';
import { useLatestProductsQuery } from '../redux/api/product.api';
import Banner from '../components/common/Banner';
import CustomerReviews from '../components/common/CustomerReviews';

// Define the HomePage component
const HomePage: React.FC = () => {

    // Fetch latest products using a Redux API hook
    const { data: productData, isLoading: productLoading, isError: productError } = useLatestProductsQuery('');

    // Extract products from the fetched data
    const products = productData?.products || [];

    // Handle loading state
    if (productLoading) {
        return <p>Loading...</p>;
    }

    // Handle error state
    if (productError) {
        return <p>Error loading products or categories</p>;
    }

    return (
        <div className='min-h-screen'>

            {/* Hero Section */}
            <FeaturedSection />

            {/* Popular Products Section */}
            <PopularProducts products={products} />

            {/* Banner Section */}
            <Banner />

            {/* Customer Reviews Section */}
            <CustomerReviews />
        </div>
    );
};

export default HomePage;
