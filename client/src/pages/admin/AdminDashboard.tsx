import 'chart.js/auto';
import dayjs from 'dayjs';
import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { useGetStatsQuery } from '../../redux/api/stats.api';


const AdminDashboard: React.FC = () => {
    const { data: statsData, isLoading, isError } = useGetStatsQuery();
    const stats = statsData?.stats;

    // Memoize table data and columns to avoid re-calculating on every render
    const data = React.useMemo(() => {
        return stats?.latestOrders.map((order) => ({
            ...order,
            orderItems: order.orderItems.length,
        })) || [];
    }, [stats]);

    const columns: Column[] = React.useMemo(() => [
        { Header: 'Order ID', accessor: '_id' },
        { Header: 'Date', accessor: 'createdAt', Cell: ({ value }) => dayjs(value).format('DD MMM YYYY') },
        { Header: 'Status', accessor: 'status' },
        { Header: 'Total Products', accessor: 'orderItems' },
        { Header: 'Amount', accessor: 'total' },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    // Memoize chart data to avoid re-calculating on every render
    const chartData = React.useMemo(() => ({
        labels: Object.keys(stats?.revenueByMonth || {}),
        datasets: [
            {
                label: 'Revenue by Month',
                data: Object.values(stats?.revenueByMonth || {}),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    }), [stats]);

    const pieChartData = React.useMemo(() => ({
        labels: stats?.userGenderDemographic.map((g) => g._id) || [],
        datasets: [
            {
                data: stats?.userGenderDemographic.map((g) => g.count) || [],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    }), [stats]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading stats</div>;
    }

    if (!stats) {
        return <div>No data available</div>;
    }

    return (
        <div className="p-4">
            {/* Widgets section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Widget heading="Total Revenue" value={`₹${stats.totalRevenue}`} description="Overall revenue" color="bg-blue-500" />
                <Widget heading="Total Orders" value={stats.totalOrders.toString()} description="Total number of orders" color="bg-green-500" />
                <Widget heading="Active Coupons" value={stats.totalCoupons.toString()} description="Currently active coupons" color="bg-purple-500" />
                <Widget heading="Total Products" value={stats.totalProducts.toString()} description="Total number of products" color="bg-red-500" />
            </section>

            {/* Charts section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h3 className="text-lg font-bold mb-2">Total Revenue</h3>
                    <Line data={chartData} />
                </div>
                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h3 className="text-lg font-bold mb-2">User Demographics</h3>
                    <div className="relative h-full">
                        <Pie data={pieChartData} />
                    </div>
                </div>
            </section>

            {/* Most Sold Items section */}
            <section className="bg-white p-6 rounded-md shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4">Most Sold Items</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Product ID</th>
                                <th className="px-4 py-2">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.bestSellingProducts.map((product, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">
                                        <Link to={`/admin/products/${product.productId}`} className="text-blue-600 hover:underline">
                                            {product.productId}
                                        </Link>
                                    </td>
                                    <td className="border px-4 py-2">{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Latest Orders section */}
            <section className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-xl font-bold mb-4">Latest Orders</h2>
                <div className="overflow-x-auto">
                    <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200">
                            {headerGroups.map((headerGroup, idx) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} key={column.id} className="p-2 text-left">
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={row.id} className="border-b">
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} key={cell.column.id} className="p-2">
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

// Define the Widget component
interface WidgetProps {
    heading: string;
    value: string;
    description: string;
    color: string;
}

const Widget: React.FC<WidgetProps> = ({ heading, value, description, color }) => (
    <div className={`p-4 rounded-md shadow-sm text-white ${color}`}>
        <h3 className="text-lg font-bold">{heading}</h3>
        <p className="text-2xl">{value}</p>
        <p>{description}</p>
    </div>
);

export default AdminDashboard;
