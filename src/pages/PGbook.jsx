import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookPG = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pgDetails = location.state || { pgName: "MyPG" };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    sharingType: "Double",
    stayDuration: "Monthly",
    document: null,
    selectedAmenities: [],
  });

  const amenitiesList = ["WiFi", "Laundry", "Food", "AC", "Housekeeping"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const toggleAmenity = (amenity) => {
    const updated = formData.selectedAmenities.includes(amenity)
      ? formData.selectedAmenities.filter((a) => a !== amenity)
      : [...formData.selectedAmenities, amenity];
    setFormData({ ...formData, selectedAmenities: updated });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    const booking = {
      pgName: pgDetails.pgName,
      sharingType: formData.sharingType,
      gender: formData.gender,
      stayDuration: formData.stayDuration,
      contact: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      amenities: formData.selectedAmenities,
      document: formData.document?.name || "Not uploaded",
      totalRent: 7500,
    };

    console.log("Booking Data:", booking);

    // Navigate to UPI payment screen with payment data
    navigate("/pg-upi-payment", {
      state: {
        user: { name: "ResideEase Pvt Ltd", upiId: "resideease@upi" },
        amount: booking.totalRent,
        formData: { ...formData, pgName: pgDetails.pgName },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-8 flex gap-8">
        <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">Book Your PG</h2>
          <p className="text-gray-600 mb-2">PG: {pgDetails.pgName}</p>

          <label className="block font-semibold mt-4">Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 border rounded-lg mt-1" />

          <label className="block font-semibold mt-4">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg mt-1" />

          <label className="block font-semibold mt-4">Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg mt-1" />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block font-semibold">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-lg mt-1">
                <option>Male</option>
                <option>Female</option>
                <option>Co-ed</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Sharing Type</label>
              <select name="sharingType" value={formData.sharingType} onChange={handleChange} className="w-full p-3 border rounded-lg mt-1">
                <option>Single</option>
                <option>Double</option>
                <option>Triple</option>
              </select>
            </div>
          </div>

          <label className="block font-semibold mt-4">Stay Duration</label>
          <select name="stayDuration" value={formData.stayDuration} onChange={handleChange} className="w-full p-3 border rounded-lg mt-1">
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
          </select>

          <div className="mt-6">
            <label className="block font-semibold">Upload ID Proof</label>
            <input type="file" onChange={handleFileUpload} className="w-full p-3 border rounded-lg mt-1" />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2">Select Amenities</label>
            <div className="flex flex-wrap gap-3">
              {amenitiesList.map((item) => (
                <label key={item} className="inline-flex items-center bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selectedAmenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                    className="mr-2"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700"
          >
            Confirm PG Booking
          </button>
        </div>

        <div className="w-1/3 bg-gray-50 p-6 rounded-2xl shadow-md">
          <img
            src={Array.isArray(pgDetails.img) ? pgDetails.img[0] : pgDetails.img}
            alt="PG"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h3 className="text-xl font-bold mb-2">Rent Summary</h3>
          <p>Sharing: {formData.sharingType}</p>
          <p>Duration: {formData.stayDuration}</p>
          <p>Rent Range: ₹{pgDetails.rentRange || "5000 - 8000"}</p>

          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Est.</span>
            <span>₹7500/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPG;
