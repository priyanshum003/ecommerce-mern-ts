import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackBtn';
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderStatusMutation } from '../../redux/api/order.api';
import { notify } from '../../utils/util';

const AdminOrderDetails: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { data, isLoading, isError, refetch } = useOrderDetailsQuery(orderId!);
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();
    const navigate = useNavigate();

    const handleStatusUpdate = async (status: string) => {
        try {
            await updateOrderStatus({ orderId: orderId!, status }).unwrap();
            notify('Order status updated successfully', 'success');
            refetch();
        } catch (error) {
            notify('Failed to update order status', 'error');
        }
    };

    const handleDeleteOrder = async () => {
        try {
            await deleteOrder(orderId!).unwrap();
            notify('Order deleted successfully', 'success');
            navigate('/admin/orders');
        } catch (error) {
            notify('Failed to delete order', 'error');
        }
    };

    if (isError) return <p>Error loading order details: </p>;
    if (isLoading) return <p>Loading order details...</p>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <BackButton />
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Order #{data?.order?._id}</h2>
                <p className="mb-4"><strong>Customer:</strong> {data?.order?.user.name}</p>
                <p className="mb-4"><strong>Amount:</strong> ₹ {data?.order?.total}</p>
                <p className="mb-4"><strong>Status:</strong> {data?.order?.status}</p>

                <h3 className="text-xl font-semibold mt-6 mb-2">Order Items</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.order.orderItems.map(item => (
                                <tr key={item.productId} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 border-b border-gray-300 text-sm">{item.name}</td>
                                    <td className="py-3 px-4 border-b border-gray-300 text-sm">{item.quantity}</td>
                                    <td className="py-3 px-4 border-b border-gray-300 text-sm">₹ {item.price}</td>
                                    <td className="py-3 px-4 border-b border-gray-300 text-sm">₹ {item.quantity * item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium">Update Status:</label>
                        <select
                            className="p-2 border rounded-md"
                            value={data?.order?.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    <button
                        onClick={handleDeleteOrder}
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition duration-300"
                    >
                        Delete Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
