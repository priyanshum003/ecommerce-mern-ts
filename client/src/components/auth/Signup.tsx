import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { auth } from '../../firebaseConfig';
import { useSignupUserMutation } from '../../redux/api/user.api';
import { userExists } from '../../redux/reducers/user.reducer';
import { AppDispatch } from '../../redux/store';
import { notify } from '../../utils/util';
import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';

const SIGNUP_SUCCESS = 'Sign up successful';
const SIGNUP_FAILED = 'Sign up failed';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userCredential, setUserCredential] = useState<UserCredential | null>(null);

  const [signupUser] = useSignupUserMutation();
  const dispatch = useDispatch<AppDispatch>();

  const handleResponse = async (userCredential: UserCredential, successMessage: string, failureMessage: string) => {
    try {
      const idToken = await userCredential.user.getIdToken();
      const response = await signupUser({ idToken, name, gender, dob }).unwrap();
      console.log('response', response);

      if (response.user) {
        dispatch(userExists(response.user));
        notify(successMessage, 'success');
      } else {
        notify(failureMessage, 'error');
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || 'An unknown error occurred';
      notify(errorMessage, 'error');
    }
  };

  const handleInitialSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      notify('All fields are required', 'error');
      return;
    }
    if (password !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUserCredential(userCredential);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('error', error);
        notify(error.message, 'error');
      } else {
        notify('An unknown error occurred', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      setUserCredential(userCredential);
    } catch (error: unknown) {
      if (error instanceof Error) {
        notify("Google sign-in failed", 'error');
      } else {
        notify('An unknown error occurred', 'error');
      }
    }
  };

  const handleCompleteSignup = async () => {
    if (!name || !gender || !dob) {
      notify('All fields are required', 'error');
      return;
    }
    if (userCredential) {
      await handleResponse(userCredential, SIGNUP_SUCCESS, SIGNUP_FAILED);
      setUserCredential(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg p-6">
        <h5 className="text-xl font-bold text-center mb-8">Sign Up</h5>
        {!userCredential && (
          <>
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
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span className="ml-2">Show Password</span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="button"
                onClick={handleInitialSignUp}
                disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-gray-500">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="mt-4">
              <button
                disabled={isLoading}
                className={`flex items-center justify-center text-gray-700 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 shadow-md bg-white hover:bg-gray-100 gap-2 w-full border border-gray-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleGoogleLogin}
              >
                <FcGoogle className='text-2xl' />
                Sign Up with Google
              </button>
            </div>
          </>
        )}
        {userCredential && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="gender">Gender</label>
              <select
                id="gender"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="button"
                onClick={handleCompleteSignup}
              >
                Complete Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
