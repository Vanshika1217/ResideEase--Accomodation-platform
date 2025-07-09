import React from "react";
import { useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PGBookingReceipt from "./PGBookingReceipt";
import Navbar from "../components/Navbar";

const PGBookingConfirmed = () => {
  const location = useLocation();
  const formData = location.state;

  if (!formData) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Details Not Found</h2>
            <p className="text-gray-700">Please complete your PG booking again.</p>
          </div>
        </div>
      </>
    );
  }

  const {
    fullName,
    email,
    phone,
    gender,
    sharingType,
    stayDuration,
    selectedAmenities,
    document,
  } = formData;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-green-600 mb-4">PG Booking Confirmed ✅</h2>
        <p className="text-lg text-gray-700">
          Your stay is confirmed at <span className="font-bold">{formData.pgName}</span>
        </p>

        <div className="mt-3 p-6 bg-white shadow-md rounded-lg w-full max-w-lg">
          <h3 className="text-xl font-bold mb-3 text-blue-700">Guest Details</h3>
          <p><b>Name:</b> {fullName}</p>
          <p><b>Email:</b> {email}</p>
          <p><b>Phone:</b> {phone}</p>

          <h3 className="text-xl font-bold mt-4 mb-3 text-blue-700">Booking Details</h3>
          <p><b>Gender:</b> {gender}</p>
          <p><b>Sharing Type:</b> {sharingType}</p>
          <p><b>Stay Duration:</b> {stayDuration}</p>
          <p><b>Selected Amenities:</b> {selectedAmenities.join(", ") || "None"}</p>
          <p><b>Document:</b> {document?.name || "Not Uploaded"}</p>

          <h3 className="text-xl font-bold mt-4 mb-3 text-blue-700">Rent</h3>
          <div className="flex justify-between font-bold text-lg">
            <span>Total Monthly Rent:</span>
            <span>₹ 7500</span>
          </div>
        </div>

        <PDFDownloadLink document={<PGBookingReceipt formData={formData} />} fileName="PG_Booking_Receipt.pdf">
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

export default PGBookingConfirmed;
