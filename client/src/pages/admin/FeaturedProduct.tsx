import React, { useEffect, useState } from 'react';
import { useGetAllFeaturedProductsQuery, useFeatureProductMutation } from '../../redux/api/product.api';
import { Product } from '../../types/api-types';

const AdminFeaturedProducts: React.FC = () => {
    const { data, isLoading } = useGetAllFeaturedProductsQuery('');
    const [featureProduct] = useFeatureProductMutation();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (data && data.products) {
            setProducts(data.products);
        }
    }, [data]);

    const handleFeatureToggle = async (productId: string) => {
        try {
            await featureProduct({ productId }).unwrap();
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error updating featured status', error);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Admin - Featured Products</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Photo</th>
                            <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                            <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} className="hover:bg-gray-100">
                                <td className="py-3 px-4 border-b border-gray-300">
                                    <img src={product.photo} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                </td>
                                <td className="py-3 px-4 border-b border-gray-300 text-sm">{product._id}</td>
                                <td className="py-3 px-4 border-b border-gray-300 text-sm">{product.name}</td>
                                <td className="py-3 px-4 border-b border-gray-300">
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs
                                        hover:bg-red-600 transition-colors duration-300 ease-in-out"
                                        onClick={() => handleFeatureToggle(product._id)}
                                    >
                                        Remove 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminFeaturedProducts;
