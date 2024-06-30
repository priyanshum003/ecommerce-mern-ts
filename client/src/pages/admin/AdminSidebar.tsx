import { signOut } from 'firebase/auth';
import React from 'react';
import { FaBox, FaClipboardList, FaMoneyCheckAlt, FaSignOutAlt, FaTachometerAlt, FaTimes, FaUsers } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { useLogoutUserMutation } from '../../redux/api/user.api';
import { userNotExists } from '../../redux/reducers/user.reducer';
import { notify } from '../../utils/util';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout] = useLogoutUserMutation();

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      await logout().unwrap();
      toggleSidebar();
      dispatch(userNotExists());
      notify('Logout successful', 'success');
      navigate('/auth');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      notify(errorMessage, 'error');
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white p-5 shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block z-40`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden mb-4">
          <button onClick={toggleSidebar} className="text-2xl">
            <FaTimes />
          </button>
        </div>
        {/* Logo and Home Link */}
        <Link to="/" onClick={toggleSidebar}>
          <div className="flex justify-start mb-10 cursor-pointer">
            <h1 className="text-2xl font-bold text-blue-900">SHOPSPOT</h1>
          </div>
        </Link>
        {/* Navigation Links */}
        <nav>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? 'flex items-center p-2 my-4 text-blue-600 font-bold' : 'flex items-center p-2 my-4 text-gray-600 hover:text-blue-600'
            }
            onClick={toggleSidebar}
          >
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? 'flex items-center p-2 my-4 text-blue-600 font-bold' : 'flex items-center p-2 my-4 text-gray-600 hover:text-blue-600'
            }
            onClick={toggleSidebar}
          >
            <FaBox className="mr-2" />
            Products
          </NavLink>

          <NavLink
            to="/admin/featured"
            className={({ isActive }) =>
              isActive ? 'flex items-center p-2 my-4 text-blue-600 font-bold' : 'flex items-center p-2 my-4 text-gray-600 hover:text-blue-600'
            }
            onClick={toggleSidebar}
          >
            <FaBox className="mr-2" />
            Featured Products
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive ? 'flex items-center p-2 my-4 text-blue-600 font-bold' : 'flex items-center p-2 my-4 text-gray-600 hover:text-blue-600'
            }
            onClick={toggleSidebar}
          >
            <FaUsers className="mr-2" />
            Customers
          </NavLink>

          <NavLink
            to="/admin/coupons"
            className={({ isActive }) =>
              isActive ? 'flex items-center p-2 my-4 text-blue-600 font-bold' : 'flex items-center p-2 my-4 text-gray-600 hover:text-blue-600'
            }
            onClick={toggleSidebar}
          >
            <FaMoneyCheckAlt className="mr-2" />
            Coupons
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? 'flex items-center p-2 my-4 text-blue-600 font-bold' : 'flex items-center p-2 my-4 text-gray-600 hover:text-blue-600'
            }
            onClick={toggleSidebar}
          >
            <FaClipboardList className="mr-2" />
            Orders
          </NavLink>

          <button type='button' onClick={logoutHandler} className="flex items-center p-2 my-4 text-gray-600 hover:text-blue-600">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
