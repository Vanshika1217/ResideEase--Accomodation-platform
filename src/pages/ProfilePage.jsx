import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  LogOut,
  CalendarCheck,
  CalendarX,
  User,
} from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBookings = () => {
    navigate("/fetchBookings");
  };

  const cancelBookings = () => {
    navigate("/cancelBookings");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="text-xl font-semibold">⚠ Please log in to view your profile.</p>
        <button
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-12 bg-white p-10 rounded-2xl shadow-lg">
        <div className="flex items-center mb-6 gap-3">
          <User className="text-blue-600" size={32} />
          <h2 className="text-3xl font-bold">User Profile</h2>
        </div>

        <div className="mb-8 space-y-2 pl-1">
          <p className="text-lg"><strong>Name:</strong> {user.username}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck className="text-green-600" />
            Booking Options
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex items-center gap-2 bg-blue-500 px-4 py-2 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={handleBookings}
            >
              <CalendarCheck size={20} />
              View Bookings
            </button>

            <button
              className="flex items-center gap-2 bg-yellow-500 px-4 py-2 text-white rounded-lg hover:bg-yellow-600 transition"
              onClick={cancelBookings}
            >
              <CalendarX size={20} />
              Cancel Bookings
            </button>
          </div>
        </div>

        <div className="mt-10">
          <button
            className="flex items-center gap-2 bg-red-500 px-4 py-2 text-white rounded-lg hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
