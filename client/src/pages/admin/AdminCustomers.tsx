import React from 'react';
import { Column, useTable } from 'react-table';
import { useGetAllUsersQuery } from '../../redux/api/user.api'; // Adjust the import path according to your project structure
import { User as UserType } from '../../types/api-types'; // Adjust the import path according to your project structure
import dayjs from 'dayjs';

const AdminCustomers: React.FC = () => {
    // Fetch all users using a Redux API hook
    const { data, error, isLoading } = useGetAllUsersQuery('');
    const users: UserType[] = data?.users || [];

    // Define table columns
    const columns: Column<UserType>[] = React.useMemo(
        () => [
            {
                Header: 'Profile',
                accessor: 'photoURL',
                Cell: ({ value }: { value: string }) => (
                    <img src={value} alt="Profile" className="w-10 h-10 rounded-full" />
                ),
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Date of Birth',
                accessor: 'dob',
                Cell: ({ value }: { value: string }) => dayjs(value).format('DD MMM YYYY'),
            },
            {
                Header: 'Gender',
                accessor: 'gender',
            },
        ],
        []
    );

    // Initialize table instance
    const tableInstance = useTable({ columns, data: users });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading users</p>;

    return (
        <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>
            <p className="mb-6">Here you can view and manage customer information.</p>
            {users.length > 0 ? (
                <div className="overflow-x-auto">
                    <table {...getTableProps()} className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="bg-gray-100">
                            {headerGroups.map((headerGroup, headerGroupIndex) => {
                                const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                                return (
                                    <tr key={headerGroupIndex} {...headerGroupProps}>
                                        {headerGroup.headers.map((column, columnIndex) => {
                                            const { key: columnKey, ...columnProps } = column.getHeaderProps();
                                            return (
                                                <th
                                                    key={columnIndex}
                                                    {...columnProps}
                                                    className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                    {column.render('Header')}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row, rowIndex) => {
                                prepareRow(row);
                                const { key: rowKey, ...rowProps } = row.getRowProps();
                                return (
                                    <tr key={rowIndex} {...rowProps} className="hover:bg-gray-50">
                                        {row.cells.map((cell, cellIndex) => {
                                            const { key: cellKey, ...cellProps } = cell.getCellProps();
                                            return (
                                                <td key={cellIndex} {...cellProps} className="py-3 px-4 border-b border-gray-300 text-sm">
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default AdminCustomers;
