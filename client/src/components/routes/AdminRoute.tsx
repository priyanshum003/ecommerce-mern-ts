import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const AdminRoute: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);

    // Assuming user object has an `isAdmin` property
    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
