import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartItem = cartItems.find(item => item.productId === product._id);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      photo: product.photo,
    };
    dispatch(addToCart(cartItem));
  };

  const handleIncrement = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(incrementCartItem(product._id));
  };

  const handleDecrement = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(decrementCartItem(product._id));
  };

  const handleGoToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate('/cart');
  };

  const handleNavigateToProduct = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  return (
    <div onClick={handleNavigateToProduct} className="block cursor-pointer">
      <div className="border rounded-lg p-4 flex flex-col justify-between h-full shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white transform hover:-translate-y-2">
        {/* Product image */}
        <div className="flex-shrink-0 mb-4">
          <img
            src={product.photo || 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-full h-48 object-contain rounded-md transition-transform duration-300 transform hover:scale-105"
            style={{ aspectRatio: '1 / 1' }}
          />
        </div>

        {/* Product name */}
        <h3 className="text-xl font-bold mb-2 text-center">{product.name}</h3>

        {/* Product price */}
        <p className="text-lg mb-4 text-gray-700 text-center">₹ {product.price}</p>

        {/* Quantity controls */}
        {cartItem ? (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <button onClick={handleDecrement} className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">-</button>
            <span className="text-lg font-semibold">{cartItem.quantity}</span>
            <button onClick={handleIncrement} className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">+</button>
          </div>
        ) : (
          /* Add to cart button */
          <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 mb-4">
            Add to Cart
          </button>
        )}

        {/* Link to product details or Go to Cart button */}
        {cartItem ? (
          <button onClick={handleGoToCart} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
            Go to Cart
          </button>
        ) : (
          <button onClick={handleNavigateToProduct} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 mt-2 text-center">
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;