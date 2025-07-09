import React from "react";
import { useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingReceipt from "./BookingReceipt";
import Navbar from "../components/Navbar";

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
    FirstName,
    LastName,
    EmailId,
    PhoneNumber,
    checkIn,
    checkOut,
    guests,
    rooms,
    destination,
    basePrice = 23500,
    tax = 4230,
    totalAmount = 27730,
  } = formData;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed ✅</h2>
        <p className="text-lg text-gray-700">
          Your stay at <span className="font-bold">{destination}</span> is confirmed.
        </p>

        <div className="mt-3 p-6 bg-white shadow-md rounded-lg w-full max-w-lg">
          <h3 className="text-xl font-bold mb-3 text-blue-700">Guest Details</h3>
          <p><b>Name:</b> {FirstName} {LastName}</p>
          <p><b>Email:</b> {EmailId}</p>
          <p><b>Phone:</b> {PhoneNumber}</p>

          <h3 className="text-xl font-bold mt-4 mb-3 text-blue-700">Booking Details</h3>
          <p><b>Check-in:</b> {checkIn}</p>
          <p><b>Check-out:</b> {checkOut}</p>
          <p><b>Guests:</b> {guests}</p>
          <p><b>Rooms:</b> {rooms}</p>

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

        <PDFDownloadLink document={<BookingReceipt formData={formData} />} fileName="Booking_Receipt.pdf">
          {({ loading }) =>
            loading ? (
              <button className="mt-4 bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                Generating...
              </button>
            ) : (
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition">
                Download Receipt
              </button>
            )
          }
        </PDFDownloadLink>
      </div>
    </>
  );
};

export default BookingConfirmed;