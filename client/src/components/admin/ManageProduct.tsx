import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDeleteProductMutation, useFeatureProductMutation, useProductDetailsQuery, useUpdateProductMutation } from '../../redux/api/product.api';
import { CustomError } from '../../types/api-types';
import { notify } from '../../utils/util';
import SkeletonLoader from '../common/SkeletonLoader';
import dayjs from 'dayjs';
import BackButton from '../common/BackBtn';

const AdminManageProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useProductDetailsQuery(productId!);

    // Destructuring the product object
    const {  category, name, stock, price, featured, createdAt, updatedAt, description } = data?.product || {
        photo: "",
        category: "",
        name: "",
        stock: 0,
        price: 0,
        featured: false,
        createdAt: "",
        updatedAt: "",
        description: "",
    }

    const [priceUpdate, setPriceUpdate] = useState<number>(price);
    const [stockUpdate, setStockUpdate] = useState<number>(stock);
    const [nameUpdate, setNameUpdate] = useState<string>(name);
    const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
    const [photoUpdate, setPhotoUpdate] = useState<string>('');
    const [photoFile, setPhotoFile] = useState<File>();
    const [isFeatured, setIsFeatured] = useState<boolean>(featured);
    const [descriptionUpdate, setDescriptionUpdate] = useState<string>(description);

    const [updateProduct, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting, isError: isDeleteError, error: deleteError }] = useDeleteProductMutation();
    const [featureProduct, { isLoading: isFeaturing }] = useFeatureProductMutation();

    const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];

        const reader: FileReader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setPhotoUpdate(reader.result);
                    setPhotoFile(file);
                }
            };
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const formData = new FormData();
        if (nameUpdate) formData.append('name', nameUpdate);
        if (priceUpdate) formData.append('price', priceUpdate.toString());
        if (stockUpdate !== undefined) formData.append('stock', stockUpdate.toString());
        if (categoryUpdate) formData.append('category', categoryUpdate);
        if (photoFile) formData.append('photo', photoFile);
        if (descriptionUpdate) formData.append('description', descriptionUpdate);

        if (!data || !data.product._id) {
            notify('Product not found', 'error');
            return;
        }

        const res = await updateProduct({
            formData,
            productId: data.product._id,
        });

        if (res.error) {
            notify('Failed to update product', 'error');
        } else {
            notify('Product updated successfully', 'success');
            navigate('/admin/products');
        }
    };

    useEffect(() => {
        if (isError && error) {
            const err = error as CustomError;
            notify(err.data.message, 'error');
        }
    }, [isError, error]);

    const deleteHandler = async (): Promise<void> => {
        if (!data || !data.product._id) {
            notify('Product not found', 'error');
            return;
        }

        const res = await deleteProduct({
            productId: data.product._id,
        });

        if (res.error) {
            notify('Failed to delete product', 'error');
        } else {
            notify('Product deleted successfully', 'success');
            navigate('/admin/products');
        }
    };

    useEffect(() => {
        if (data) {
            setNameUpdate(data.product.name);
            setPriceUpdate(data.product.price);
            setStockUpdate(data.product.stock);
            setCategoryUpdate(data.product.category);
            setPhotoUpdate(`${data.product.photo}`);
            setIsFeatured(data.product.featured);
            setDescriptionUpdate(data.product.description);
        }
    }, [data]);

    useEffect(() => {
        if (isUpdateError && updateError) {
            const err = updateError as CustomError;
            notify(err.data.message, 'error');
        }
    }, [isUpdateError, updateError]);

    useEffect(() => {
        if (isDeleteError && deleteError) {
            const err = deleteError as CustomError;
            notify(err.data.message, 'error');
        }
    }, [isDeleteError, deleteError]);

    const handleFeatureToggle = async () => {
        if (!data || !data.product._id) {
            notify('Product not found', 'error');
            return;
        }

        try {
            await featureProduct({ productId: data.product._id }).unwrap();
            notify('Product featured status updated successfully', 'success');
        } catch (error) {
            notify('Failed to update product featured status', 'error');
        }
    };

    if (isError) return <Navigate to="/404" />;

    if (isLoading) return <SkeletonLoader rows={10} />;

    return (
        <div className="bg-white p-6 rounded-md shadow-sm min-h-screen">
            <BackButton />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Product</h2>
                <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isFeatured ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-lg">{isFeatured ? 'Featured' : 'Not Featured'}</span>
                </div>
            </div>
            {photoUpdate && (
                <div className="flex justify-center mb-6">
                    <img src={photoUpdate} alt="Product" className="w-64 h-64 object-cover rounded-md" />
                </div>
            )}
            <form onSubmit={submitHandler}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={nameUpdate}
                            onChange={(e) => setNameUpdate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={categoryUpdate}
                            onChange={(e) => setCategoryUpdate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={descriptionUpdate}
                            onChange={(e) => setDescriptionUpdate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            rows={4}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={stockUpdate}
                            onChange={(e) => setStockUpdate(parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price ( ₹ )
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={priceUpdate}
                            onChange={(e) => setPriceUpdate(parseFloat(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 mb-2">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={changeImageHandler}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Created At</label>
                        <input
                            type="text"
                            value={dayjs(createdAt).format('MMMM D, YYYY h:mm A')}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Last Updated</label>
                        <input
                            type="text"
                            value={dayjs(updatedAt).format('MMMM D, YYYY h:mm A')}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={deleteHandler}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                        type="button"
                        onClick={handleFeatureToggle}
                        disabled={isFeaturing}
                        className={`px-4 py-2 ${isFeatured ? 'bg-yellow-600' : 'bg-green-600'} text-white rounded-md hover:${isFeatured ? 'bg-yellow-700' : 'bg-green-700'} transition`}
                    >
                        {isFeaturing ? 'Updating...' : isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminManageProduct;
