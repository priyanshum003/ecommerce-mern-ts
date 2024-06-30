import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useOrderDetailsQuery } from '../redux/api/order.api';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, isError } = useOrderDetailsQuery(id!);

    if (isLoading) {
        return <p className="text-center text-lg">Loading...</p>;
    }

    if (isError || !data) {
        return <p className="text-center text-lg text-red-500">Error loading order details</p>;
    }

    const { order } = data;

    return (
        <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md min-h-screen">
            
            <BackButton />
            <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Order ID: {order._id}</h3>
                <p>Status: <span className="font-medium">{order.status}</span></p>
                <p>Placed on: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
            </div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Shipping Information</h3>
                <p>Address: <span className="font-medium">{order.shippingInfo.address}</span></p>
                <p>City: <span className="font-medium">{order.shippingInfo.city}</span></p>
                <p>Phone: <span className="font-medium">{order.shippingInfo.phone}</span></p>
                <p>Pin Code: <span className="font-medium">{order.shippingInfo.pinCode}</span></p>
                <p>Country: <span className="font-medium">{order.shippingInfo.country}</span></p>
            </div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Order Items</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="p-4">Product</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item) => (
                                <tr className="border-b hover:bg-gray-100" key={item._id}>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <img src={item.photo} alt="Product" className="h-12 w-12 object-cover rounded-lg" />
                                            <div>{item.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">{item.quantity}</td>
                                    <td className="p-4">${item.price.toFixed(2)}</td>
                                    <td className="p-4">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>${order.shippingCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span>${order.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
