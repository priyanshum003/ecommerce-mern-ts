import {
  Elements,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useNewOrderMutation } from '../redux/api/order.api';
import { useCreatePaymentIntentMutation } from '../redux/api/payment.api';
import { resetCart } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { notify } from '../utils/util';
import BackButton from '../components/common/BackBtn';

// Ensure the environment variable is set correctly
const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

// Define the CheckoutForm component
const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
  const {
    shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cart);

  const [newOrder] = useNewOrderMutation();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Function to handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      notify('Stripe has not been properly initialized', 'error');
      return;
    }

    if (!user) {
      notify('Please login to place order', 'error');
      return;
    }

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingCharges,
      shippingInfo,
      tax,
      discount,
      total,
      subTotal,
      orderItems: cartItems,
      userId: user?._id,
    };

    try {
      const res = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin
        },
        redirect: 'if_required'
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      // Uncomment the following lines once your Stripe account is activated
      // if (res.paymentIntent?.status === "succeeded") {
      //     const orderResponse = await newOrder(orderData);
      //     if (orderResponse.error) {
      //         throw new Error(orderResponse.error.message);
      //     }
      //     dispatch(resetCart());
      //     notify('Order placed successfully', 'success');
      //     navigate("/orders");
      // }

    } catch (error: any) {
      console.error(error);
      notify(error.message, 'error');
    } finally {
      // Comment out the following lines once your Stripe account is activated
      const orderResponse = await newOrder(orderData);
      console.log(orderResponse, "orderResponse");
      if (orderResponse.error) {
        notify(`${orderResponse.error! || 'Failed to place order'}` as string, 'error');
        setIsProcessing(false);
      } else {
        dispatch(resetCart());
        notify('Order placed successfully', 'success');
        navigate("/my-orders");
        setIsProcessing(false);
      }
    }
  };

  return (
    <>

      <div className="checkout-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

        <div className="w-full max-w-lg m-4">
          <BackButton />
        </div>
        <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900">ShopSpot</h1>
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
          <div className="text-lg mb-4">
            <p>Total Amount: ₹ {total.toFixed(2)}</p>
          </div>
          <PaymentElement className="mb-4" />
          <button type="submit" disabled={isProcessing} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
            {isProcessing ? "Processing..." : `Pay ₹ ${total.toFixed(2)}`}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>Powered by <a href="https://stripe.com" target="_blank" rel="noreferrer" className="text-blue-500">Stripe</a></p>
        </div>
      </div>
    </>
  );
};

// Define the Checkout component
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { total } = useSelector((state: RootState) => state.cart);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const data = await createPaymentIntent({ amount: total }).unwrap();
        setClientSecret(data.client_secret);
        setLoading(false);
      } catch (error) {
        console.error("Failed to create payment intent", error);
        // notify("Failed to create payment intent", "error");
        navigate('/cart');
      }
    };

    fetchPaymentIntent();
  }, [createPaymentIntent, total, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!clientSecret) {
    console.log('Client secret not found');
    return <Navigate to="/cart" />;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
