import React, { useEffect, useState } from 'react';
import { useAllProductsQuery, useFeatureProductMutation } from '../../redux/api/product.api';

interface AddFeaturedProductModalProps {
    closeModal: () => void;
    featuredProducts: any[];
    setFeaturedProducts: (products: any[]) => void;
}

const AddFeaturedProductModal: React.FC<AddFeaturedProductModalProps> = ({
    closeModal,
    featuredProducts,
    setFeaturedProducts,
}) => {
    const { data: allProductsData, isLoading: isAllProductsLoading } = useAllProductsQuery({ page: 1, limit: 10, sortBy: { id: '', desc: false } });
    const [featureProduct] = useFeatureProductMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (allProductsData && allProductsData.products) {
            const nonFeaturedProducts = allProductsData.products.filter(product => !product.featured);
            setFilteredProducts(nonFeaturedProducts);
        }
    }, [allProductsData]);

    const handleAddFeature = async (productId: string) => {
        try {
            await featureProduct({ productId }).unwrap();
            const updatedProduct = allProductsData.products.find(product => product._id === productId);
            if (updatedProduct) {
                setFeaturedProducts([...featuredProducts, { ...updatedProduct, featured: true }]);
                setFilteredProducts(filteredProducts.filter(product => product._id !== productId));
            }
        } catch (error) {
            console.error('Error updating featured status', error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const filtered = allProductsData.products.filter(product =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase()) && !product.featured
        );
        setFilteredProducts(filtered);
    };

    if (isAllProductsLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-3/4 mx-auto">
            <h2 className="text-xl font-semibold mb-4">Add Featured Product</h2>
            <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Image</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product._id}>
                            <td className="py-2 px-4 border-b">{product.name}</td>
                            <td className="py-2 px-4 border-b">{product._id}</td>
                            <td className="py-2 px-4 border-b">
                                <img src={product.photoUrl} alt={product.name} className="w-16 h-16" />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleAddFeature(product._id)}
                                >
                                    Add to Featured
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={closeModal}
            >
                Close
            </button>
        </div>
    );
};

export default AddFeaturedProductModal;
