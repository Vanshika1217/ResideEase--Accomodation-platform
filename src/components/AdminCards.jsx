import React from 'react';
import { useNavigate } from "react-router-dom";
import { useFetch } from '../context/FetchContext';

const AdminCards = ({ title, description }) => {
  const { setParam } = useFetch();
  const navigate = useNavigate();

  // For non-user entities
  const handleEntityNavigation = async (path) => {
    await setParam(title);
    navigate(path);
  };

  // For users
  const handleUserNavigation = (path) => {
    navigate(path);
  };

  // Chat button
  const handleChat = () => {
    navigate('/admin/chatroom'); // ✅ Ensure this route exists in App.jsx
  };

  const isUsers = title === "Users";

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white">
      <div className="px-4 py-6 text-center">
        <h2 className="font-bold text-xl mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 text-base mb-4">{description}</p>

        <div className="flex flex-col space-y-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() =>
              isUsers
                ? handleUserNavigation('/admin/fetchUsers')
                : handleEntityNavigation('/admin/fetchItems')
            }
          >
            Fetch {title}
          </button>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            onClick={() =>
              isUsers
                ? handleUserNavigation('/admin/addUser')
                : handleEntityNavigation('/admin/addItem')
            }
          >
            Add {title}
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() =>
              isUsers
                ? handleUserNavigation('/admin/removeUser')
                : handleEntityNavigation('/admin/removeItems')
            }
          >
            Remove {title}
          </button>

          {isUsers && (
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              onClick={handleChat}
            >
              Chat with Customers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCards;
