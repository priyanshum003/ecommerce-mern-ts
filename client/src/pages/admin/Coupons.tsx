import React, { useState } from 'react';
import { useGetAllCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '../../redux/api/coupon.api';
import { notify } from '../../utils/util';
import dayjs from 'dayjs';

const AdminCoupons: React.FC = () => {
    const { data, refetch, isLoading: isFetchingCoupons, isError: fetchError } = useGetAllCouponsQuery();
    const [createCoupon] = useCreateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();
    const [code, setCode] = useState('');
    const [amount, setAmount] = useState<number | string>('');

    const handleCreateCoupon = async () => {
        if (!code || !amount) {
            notify('Please fill all fields', 'error');
            return;
        }

        try {
            await createCoupon({ code, amount }).unwrap();
            notify('Coupon created successfully', 'success');
            setCode('');
            setAmount('');
            refetch();
        } catch (error) {
            notify('Failed to create coupon', 'error');
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        try {
            console.log(id, 'id');
            await deleteCoupon(id).unwrap();
            notify('Coupon deleted successfully', 'success');
            refetch();
        } catch (error) {
            notify('Failed to delete coupon', 'error');
        }
    };

    if (isFetchingCoupons) return <p>Loading coupons...</p>;
    if (fetchError) return <p>Error loading coupons</p>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md min-h-screen">
            <h1 className="text-3xl font-bold mb-6"> Coupons</h1>

            <div className="mb-6">
                <h2 className="text-xl mb-4">Create Coupon</h2>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Coupon Code"
                        className="border p-3 rounded-md w-full md:w-auto"
                    />
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="border p-3 rounded-md w-full md:w-auto"
                    />
                    <button
                        onClick={handleCreateCoupon}
                        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Create Coupon
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-xl mb-4">Existing Coupons</h2>
                {data?.coupons.length === 0 ? (
                    <p>No coupons available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Created Date</th>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">{coupon.code}</td>
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">₹ {coupon.amount.toFixed(2)}</td>
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">{dayjs(coupon.createdAt).format('DD/MM/YYYY')
                                        }</td>
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">
                                            <button
                                                onClick={() => handleDeleteCoupon(coupon._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md text-xs hover:bg-red-600 transition duration-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;
