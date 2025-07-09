import React from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";

const DisplayUsers = ({ user }) => {
  return (<>
    
    <div className="flex justify-center items-center min-h-100 bg-gray-300 p-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{user.username}</h2>
            <p className="text-sm text-gray-500">User Profile</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-700">
            <FaUser className="mr-2 text-blue-500" />
            <span className="text-base"> {user.username}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaEnvelope className="mr-2 text-blue-500" />
            <span className="text-base"> {user.email}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DisplayUsers;
