import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';
import { useGetAllFeaturedProductsQuery } from '../redux/api/product.api';

const FeaturedSection: React.FC = () => {

    // Fetch all featured products using a Redux API hook
    const { data } = useGetAllFeaturedProductsQuery('');
    const products = data?.products || [];

    return (
        <section className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md">
            {/* Carousel to display featured products */}
            <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay>
                {products.map((product) => (
                    <div
                        className="flex flex-col md:flex-row justify-between items-center p-4"
                        key={product.name}
                    >
                        {/* Product Details Section */}
                        <div className="w-full md:w-1/2 p-4 text-center md:text-left order-2 md:order-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                            <p className="mb-4 text-gray-600">{product.description}</p>
                            <div className="flex space-x-4 justify-center md:justify-start">
                                {/* Link buttons for shopping and viewing more details */}
                                <Link
                                    to={`/product/${product._id}`}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                                >
                                    Shop now
                                </Link>
                                <Link
                                    to={`/product/${product._id}`}
                                    className="border-2 border-black text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                                >
                                    View more
                                </Link>
                            </div>
                        </div>

                        {/* Product Image Section */}
                        <div className="w-full md:w-1/2 p-4 relative order-1 md:order-2">
                            <img
                                src={product.photo}
                                alt={product.name}
                                className="w-full max-w-xs mx-auto md:max-w-md max-h-96 object-contain" // Add object-contain here
                            />

                        </div>
                    </div>
                ))}
            </Carousel>
        </section>
    );
};

export default FeaturedSection;
