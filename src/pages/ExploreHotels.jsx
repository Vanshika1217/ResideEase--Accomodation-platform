import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation
import Navbar from "../components/Navbar";

const ExploreHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(""); // Sorting state

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/accommodations/hotels`)
      .then((response) => setHotels(response.data))
      .catch((error) => console.error("Error fetching hotels:", error));
  }, []);

  // Filtering hotels based on search query
  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting hotels based on selected option
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortOption === "rating") return b.rating - a.rating; // High to Low Rating
    if (sortOption === "price") return a.price - b.price; // Low to High Price
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      {/* Search & Sort Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search hotels by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-3/4 md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Sort Options */}
        <select
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort by</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="price">Price (Low to High)</option>
        </select>
      </div>

      {/* Hotels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-12 max-w-6xl mx-auto">
        {sortedHotels.length > 0 ? (
          sortedHotels.map((hotel) => (
            <div key={hotel._id} className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
              <img 
                src={hotel.images[0]} 
                alt={hotel.name} 
                className="w-full h-48 object-cover rounded-md"
                onError={(e) => e.target.src = "https://via.placeholder.com/300"} // Fallback image
              />
              <h3 className="text-2xl font-semibold mt-4">
                {/* Link to Hotel Detail Page */}
                <Link to={`/hotels/${hotel._id}`} className="text-blue-600 hover:underline">
                  {hotel.name}
                </Link>
              </h3>
              <p className="text-gray-700">{hotel.location.address}, {hotel.location.city}</p>
              <p className="text-gray-800 font-bold mt-2">₹{hotel.price}/night</p>
              <p className="text-yellow-500 mt-2">⭐ {hotel.rating} / 5</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default ExploreHotels;
