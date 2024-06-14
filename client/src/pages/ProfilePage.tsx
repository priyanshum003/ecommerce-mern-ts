import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center shadow-2xl rounded-lg">
      <h1 className="text-4xl font-bold mb-2 text-black">Profile</h1>
      {user ? (
        <div className="bg-white  rounded-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center">
            <img
              src={user.photoURL}
              alt="Profile"
              className="h-32 w-32 rounded-full mb-6 object-cover shadow-lg"
            />
            <p className="text-2xl font-bold mb-2 text-gray-900">{user.name}</p>
            <p className="text-gray-600 mb-4">{user.email}</p>
          </div>
          <div className="mt-4 space-y-4 text-lg text-gray-700">
            <p>
              <span className="font-semibold">Role: </span>{user.role}
            </p>
            <p>
              <span className="font-semibold">Sign In Method: </span>{user.provider}
            </p>
            <p>
              <span className="font-semibold">Gender: </span>{user.gender}
            </p>
            <p>
              <span className="font-semibold">Date of Birth: </span>{new Date(user.dob).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-200">You are not logged in.</p>
      )}
    </div>
  );
};

export default ProfilePage;
