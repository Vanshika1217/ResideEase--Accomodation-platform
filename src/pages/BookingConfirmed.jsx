import React from "react";
import { useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingReceipt from "./BookingReceipt";
import Navbar from "../components/Navbar";
import ChatComponent from "../components/ChatComponent"; // ✅ path to ChatComponent

const BookingConfirmed = () => {
  const location = useLocation();
  const formData = location.state;

  if (!formData) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Details Not Found</h2>
            <p className="text-gray-700">Please complete your booking again.</p>
          </div>
        </div>
      </>
    );
  }

  const {
    _id: bookingId,
    userId,
    contactInfo,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    roomType,
    totalPrice,
    placeName,
    basePrice = 23500,
    tax = 4230,
  } = formData;

  const totalAmount = totalPrice || basePrice + tax;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed ✅</h2>
        <p className="text-lg text-gray-700">
          Your stay at <span className="font-bold">{placeName}</span> is confirmed.
        </p>

        <div className="mt-3 p-6 bg-white shadow-md rounded-lg w-full max-w-lg">
          <h3 className="text-xl font-bold mb-3 text-blue-700">Guest Details</h3>
          <p><b>Name:</b> {contactInfo?.name}</p>
          <p><b>Email:</b> {contactInfo?.email}</p>
          <p><b>Phone:</b> {contactInfo?.phone}</p>

          <h3 className="text-xl font-bold mt-4 mb-3 text-blue-700">Booking Details</h3>
          <p><b>Check-in:</b> {new Date(checkInDate).toLocaleDateString()}</p>
          <p><b>Check-out:</b> {new Date(checkOutDate).toLocaleDateString()}</p>
          <p><b>Guests:</b> {numberOfGuests}</p>
          <p><b>Room Type:</b> {roomType}</p>

          <h3 className="text-xl font-bold mt-4 mb-3 text-blue-700">Price Breakdown</h3>
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span className="font-semibold">₹ {basePrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Hotel Taxes:</span>
            <span className="font-semibold">₹ {tax}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span>₹ {totalAmount}</span>
          </div>
        </div>

        {/* 🧾 PDF + 💬 Chat Side by Side */}
        <div className="mt-6 flex flex-col md:flex-row gap-6 w-full max-w-5xl">
          <PDFDownloadLink
            document={<BookingReceipt formData={formData} />}
            fileName="Booking_Receipt.pdf"
          >
            {({ loading }) =>
              loading ? (
                <button className="bg-gray-400 text-white py-2 px-6 rounded-lg cursor-not-allowed">
                  Generating...
                </button>
              ) : (
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition">
                  Download Receipt
                </button>
              )
            }
          </PDFDownloadLink>

          {/* 💬 Chat Component */}
          <div className="flex-1 bg-white p-4 shadow-lg rounded-lg">
            <ChatComponent
              bookingId={bookingId}
              senderId={userId}
              receiverId="admin" // hardcoded for admin
              senderName={contactInfo?.name || "Guest"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmed;
