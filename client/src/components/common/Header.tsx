import { signOut } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaBoxOpen, FaBox, FaHome, FaSearch, FaShoppingCart, FaTimes, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { useLogoutUserMutation } from '../../redux/api/user.api';
import { userNotExists } from '../../redux/reducers/user.reducer';
import { RootState } from '../../redux/store';
import { notify } from '../../utils/util';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutUserMutation();

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close mobile menu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Handle user logout
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      await logout().unwrap();
      dispatch(userNotExists());
      notify('Logout successful', 'success');
      navigate('/auth');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      notify(errorMessage, 'error');
    }
  };

  // Show profile menu on mouse enter
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsProfileMenuOpen(true);
  };

  // Hide profile menu on mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfileMenuOpen(false);
    }, 250);
  };

  // Close profile menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Navigate to the appropriate profile page based on user role
  const profileHandler = () => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-blue-900 text-white p-6 px-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold">ShopSpot</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex flex-col items-center gap-1 hover:text-yellow-300 transition duration-300">
            <FaHome />
            <span className="text-xs">Home</span>
          </Link>

          <Link to="/search" className="flex flex-col items-center gap-1 hover:text-yellow-300 transition duration-300">
            <FaSearch />
            <span className="text-xs">Search</span>
          </Link>

          <Link to="/products" className="flex flex-col items-center gap-1 hover:text-yellow-300 transition duration-300">
            <FaBox />
            <span className="text-xs">Products</span>
          </Link>

          <Link to="/my-orders" className="flex flex-col items-center gap-1 hover:text-yellow-300 transition duration-300">
            <FaBoxOpen />
            <span className="text-xs">My Orders</span>
          </Link>

          <Link to="/cart" className="flex flex-col items-center gap-1 hover:text-yellow-300 transition duration-300">
            <FaShoppingCart />
            <span className="text-xs">Cart</span>
          </Link>

          {/* Profile Menu */}
          <div
            className="relative flex flex-col items-center gap-1 cursor-pointer group hover:text-yellow-300 transition duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={profileButtonRef}
            onClick={!user ? () => navigate('/auth') : undefined}
          >
            <FaUser />
            <span className="text-xs">
              {user ? (user.role === 'admin' ? 'Admin' : 'Profile') : 'Sign in'}
            </span>
            {isProfileMenuOpen && user && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 mt-10 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-10 group-hover:block"
              >
                {user.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => navigate('/admin')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Admin
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/profile')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/my-orders')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {/* Profile Menu End */}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-xl text-white focus:outline-none z-50">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-blue-900 z-40 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
      >
        <div className="text-xl p-6 flex flex-col h-screen items-center justify-center">
          {/* Mobile Menu Links */}
          <div className="flex flex-col items-center space-y-4 mt-4 gap-4">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300">
              <FaHome />
              <span className="text-lg">Home</span>
            </Link>
            <Link to="/search" onClick={closeMobileMenu} className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300">
              <FaSearch />
              <span className="text-lg">Search</span>
            </Link>
            <Link to="/products" onClick={closeMobileMenu} className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300">
              <FaBox />
              <span className="text-lg">Products</span>
            </Link>
            <Link to="/my-orders" onClick={closeMobileMenu} className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300">
              <FaBoxOpen />
              <span className="text-lg">My Orders</span>
            </Link>
            <Link to="/cart" onClick={closeMobileMenu} className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300">
              <FaShoppingCart />
              <span className="text-lg">Cart</span>
            </Link>
            <div className="flex items-center space-x-2 hover:text-yellow-300 transition duration-300" onClick={() => { profileHandler(); closeMobileMenu(); }}>
              <FaUser />
              <span className="text-lg">{user ? (user.role === 'admin' ? 'Admin' : 'Profile') : 'Sign in'}</span>
            </div>
            {user && (
              <button
                onClick={() => { logoutHandler(); closeMobileMenu(); }}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
