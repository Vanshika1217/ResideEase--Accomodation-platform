import React, { useState, useEffect } from 'react';
import ChatComponent from '../components/ChatComponent';
import axios from 'axios';

const HostChat = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    axios
      .get("https://backend-resideease.onrender.com/booking/fetch")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Customer Messages</h2>

      {/* Booking list */}
      <div className="flex gap-4 flex-wrap mb-8">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className={`p-4 border-2 rounded-lg w-64 shadow-md transition-all cursor-pointer ${
              selectedBooking?._id === booking._id
                ? "bg-blue-200 border-blue-500"
                : "bg-white hover:bg-blue-50"
            }`}
            onClick={() => {
              setSelectedBooking(booking);
              setShowChat(false); // Reset chat visibility when booking changes
            }}
          >
            <p className="text-md text-gray-700">Booking with</p>
            <h3 className="text-xl font-semibold">{booking?.contactInfo?.name || "Unknown"}</h3>
          </div>
        ))}
      </div>

      {/* Chat trigger button */}
      {selectedBooking && !showChat && (
        <div className="text-center mt-6">
          <button
            className="bg-green-600 text-white text-lg px-8 py-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
            onClick={() => setShowChat(true)}
          >
            💬 Chat with Customer
          </button>
        </div>
      )}

      {/* Chat box */}
      {selectedBooking && showChat && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">
            Chat with {selectedBooking?.contactInfo?.name || "Customer"}
          </h3>

          <ChatComponent
            bookingId={selectedBooking._id}
            senderId="admin"
            receiverId={selectedBooking.userId}
            senderName="Admin"
          />
        </div>
      )}
    </div>
  );
};

export default HostChat;
