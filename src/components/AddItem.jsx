import React, { useState } from "react";
import { useFetch } from "../context/FetchContext";

const AddItem = () => {
  const { param } = useFetch();
  const [formData, setFormData] = useState({
    name: "",
    type: param === "Hotels" ? "Hotel" : param==="Flats"?"Flat":"PG",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    images: [],
    amenities: []
  });
  const [imageInput, setImageInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImage = () => {
    if (imageInput.trim() !== "") {
      setFormData({ ...formData, images: [...formData.images, imageInput] });
      setImageInput("");
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() !== "") {
      setFormData({ ...formData, amenities: [...formData.amenities, amenityInput] });
      setAmenityInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
        const response = await fetch("https://backend-resideease.onrender.com/add/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log("Response from server:", data);

        // Reset the form data using a function to ensure state updates correctly
        setFormData(prevState => ({
            ...prevState,
            name: "",
            description: "",
            price: "",
            address: "",
            city: "",
            state: "",
            images: [],
            amenities: []
        }));

        // Clear the input fields manually
        setImageInput(""); 
        setAmenityInput("");

    } catch (error) {
        console.error("Error submitting form:", error);
    }
};
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New {param}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "description", "price", "address", "city", "state"].map((field) => (
          <input
            key={field}
            type={field === "price" ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full p-2 border rounded"
          />
        ))}
        
        {/* Type Field (Uneditable) */}
        <input
          type="text"
          name="type"
          value={formData.type}
          disabled
          className="w-full p-2 border rounded bg-gray-200 text-gray-500"
        />
        
        {/* Images Input */}
        <div>
          <input
            type="text"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Enter image URL"
            className="w-full p-2 border rounded"
          />
          <button type="button" onClick={handleAddImage} className="mt-2 p-2 bg-blue-500 text-white rounded">
            Add Image
          </button>
          <ul className="mt-2">
            {formData.images.map((img, index) => (
              <li key={index} className="text-sm text-gray-700">{img}</li>
            ))}
          </ul>
        </div>
        
        {/* Amenities Input */}
        <div>
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            placeholder="Enter amenity"
            className="w-full p-2 border rounded"
          />
          <button type="button" onClick={handleAddAmenity} className="mt-2 p-2 bg-green-500 text-white rounded">
            Add Amenity
          </button>
          <ul className="mt-2">
            {formData.amenities.map((amenity, index) => (
              <li key={index} className="text-sm text-gray-700">{amenity}</li>
            ))}
          </ul>
        </div>

        <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-800">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItem;
