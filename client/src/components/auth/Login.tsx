import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { auth } from '../../firebaseConfig';
import { useLoginUserMutation } from '../../redux/api/user.api';
import { userExists } from '../../redux/reducers/user.reducer';
import { AppDispatch } from '../../redux/store';
import { notify } from '../../utils/util';
import {
    GoogleAuthProvider,
    UserCredential,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';

const LOGIN_SUCCESS = 'Login successful';
const LOGIN_FAILED = 'Login failed';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loginUser] = useLoginUserMutation();
    const dispatch = useDispatch<AppDispatch>();

    // Handles the response from Firebase login and updates the Redux store
    const handleResponse = async (userCredential: UserCredential, successMessage: string, failureMessage: string) => {
        try {
            const idToken = await userCredential.user.getIdToken();
            const response = await loginUser({ idToken }).unwrap();

            if (response.user) {
                dispatch(userExists(response.user));
                notify(successMessage, 'success');
            } else {
                notify(failureMessage, 'error');
            }
        } catch (error: any) {
            const errorMessage = error.data?.message || 'An unknown error occurred';
            notify(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handles login with email and password
    const handleLogin = async () => {
        if (!email || !password) {
            notify('Email and password are required', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleResponse(userCredential, LOGIN_SUCCESS, LOGIN_FAILED);
        } catch (error: unknown) {
            if (error instanceof Error) {
                notify(error.message, 'error');
            } else {
                notify('An unknown error occurred', 'error');
            }
            setIsLoading(false);
        }
    };

    // Handles login with Google
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, provider);
            await handleResponse(userCredential, LOGIN_SUCCESS, LOGIN_FAILED);
        } catch (error: unknown) {
            if (error instanceof Error) {
                notify("Google sign-in failed", 'error');
            } else {
                notify('An unknown error occurred', 'error');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg p-6 ">
                <h4 className="text-xl font-bold text-center mb-8">Login</h4>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="mr-2 cursor-pointer"
                        />
                        <label htmlFor="showPassword" className="text-sm text-gray-600">Show Password</label>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>

                <div className="mt-4 flex items-center justify-center">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <div className="mt-4">
                    <button
                        className={`flex items-center justify-center text-gray-700 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 shadow-md bg-white hover:bg-gray-100 gap-2 w-full border border-gray-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <FcGoogle className='text-2xl' />
                        {isLoading ? 'Logging in...' : 'Login with Google'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
