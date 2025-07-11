// pages/admin/HostChat.jsx
import React, { useState, useEffect } from 'react';
import ChatComponent from '../components/ChatComponent.jsx'; // ✅ fix path
import axios from 'axios';

const HostChat = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("https://backend-resideease.onrender.com/booking/fetch") // ✅ Ensure this exists
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Messages</h2>

      {/* Booking list */}
      <div className="flex gap-4 flex-wrap">
        {bookings.map((booking) => (
  <div
    key={booking._id}
    className={`p-3 border rounded cursor-pointer hover:bg-blue-100 ${
      selectedBooking?._id === booking._id ? "bg-blue-200" : ""
    }`}
    onClick={() => setSelectedBooking(booking)}
  >
    Booking with {booking?.contactInfo?.name || "Unknown"}
  </div>
))}

      </div>

      {/* Chat area */}
      <div className="mt-6">
        {selectedBooking ? (
          <ChatComponent
            bookingId={selectedBooking._id}
            senderId="admin" // static
            receiverId={selectedBooking.userId} // assumed field, adjust if needed
            senderName="Admin"
          />
        ) : (
          <p className="text-gray-500">Select a booking to start chat.</p>
        )}
      </div>
    </div>
  );
};

export default HostChat;
