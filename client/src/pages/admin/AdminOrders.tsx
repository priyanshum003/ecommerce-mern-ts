import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllOrdersQuery } from '../../redux/api/order.api';
import { Order } from '../../types/api-types'; // Adjust the import path according to your project structure

const AdminOrders: React.FC = () => {
    const { data, isLoading, isError } = useAllOrdersQuery('');
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.orders) {
            setOrders(data.orders);
        }
    }, [data]);

    if (isLoading) return <p>Loading orders...</p>;
    if (isError) return <p>Error loading orders</p>;

    const handleViewDetails = (orderId: string) => {
        navigate(`/admin/orders/${orderId}`);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-2xl mb-4">Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-600">No orders available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">{order._id}</td>
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">{order.user.name}</td>
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">₹ {order.total}</td>
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">{order.status}</td>
                                        <td className="py-3 px-4 border-b border-gray-300 text-sm">
                                            <button
                                                onClick={() => handleViewDetails(order._id)}
                                                className="bg-blue-500 text-white px-3 py-2 rounded-md text-xs hover:bg-blue-600 transition duration-300"
                                            >
                                                View Details
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

export default AdminOrders;
