import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import Banner from '../components/common/Banner';
import { useProductDetailsQuery } from '../redux/api/product.api';
import { addToCart, decrementCartItem, incrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';

const SingleProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { data, isLoading, isError } = useProductDetailsQuery(productId!);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const cartItem = cartItems.find(item => item.productId === productId);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading product.</p>;
    if (!data) return <p>Loading...</p>;

    const product = data.product;

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

    return (
        <>
            <div className="container mx-auto p-4 my-6">
                <BackButton />
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-1">
                        <img
                            src={product.photo}
                            alt={product.name}
                            className="w-full h-96 object-contain rounded-md"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-2xl font-semibold text-gray-800 mt-4">${(product.price / 100).toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                            {product.stock > 0 ? (
                                <>
                                    <span className="text-green-500">In stock</span>
                                    {product.stock <= 10 && (
                                        <span className="ml-4 text-red-500">
                                            Hurry up! Only {product.stock} product(s) left in stock!
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-red-500">Out of stock</span>
                            )}
                        </div>
                        <div className="mt-4">
                            <span className="font-semibold">Category: </span>{product.category}
                        </div>
                        <div className="mt-4">
                            <span className="font-semibold">Description: </span>{product.description}
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                            {cartItem ? (
                                <>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={handleDecrement} className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">-</button>
                                        <span className="text-lg font-semibold">{cartItem.quantity}</span>
                                        <button onClick={handleIncrement} className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">+</button>
                                    </div>
                                    <button onClick={handleGoToCart} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
                                        Go to Cart
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    className={`py-2 px-4 rounded-lg transition-all duration-200 ${product.stock > 0 ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    disabled={product.stock <= 0}
                                >
                                    Add to cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <Banner />
                </div>
            </div>
        </>
    );
};

export default SingleProduct;
