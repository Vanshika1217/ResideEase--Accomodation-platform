import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';

const CancelBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/booking/fetchById`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: user.token,
        },
      });

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const cancelBooking = async (_id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/booking/cancel`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: user.token,
        },
        body: JSON.stringify({ id: _id })
      });

      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== _id));
        toast.success('Booking cancelled successfully!');
      } else {
        const err = await response.json();
        toast.error(`Failed to cancel: ${err.message}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Error cancelling booking');
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchBookings();
    }
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Cancel Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 relative"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{booking.placeName}</h2>
              <p className="text-sm text-gray-600 mb-1"><strong>Type:</strong> {booking.type}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Room:</strong> {booking.roomType}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Guests:</strong> {booking.numberOfGuests}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Payment Status:</strong>{' '}
                <span className={`font-semibold ${booking.paymentStatus === 'Pending' ? 'text-red-600' : 'text-green-600'}`}>
                  {booking.paymentStatus}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Booking Status:</strong>{' '}
                <span className={`font-semibold ${booking.bookingStatus === 'Pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {booking.bookingStatus}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-2">Booked on: {new Date(booking.createdAt).toLocaleString()}</p>

              {/* Cancel button */}
              <button
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                onClick={() => cancelBooking(booking._id)}
                title="Cancel Booking"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CancelBookings;
