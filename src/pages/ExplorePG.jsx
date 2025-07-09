import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const ExplorePG = () => {
  const [pgs, setPgs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/accommodations/pgs`)
      .then((response) => setPgs(response.data))
      .catch((error) => console.error("Error fetching PGs:", error));
  }, []);

  const filteredPGs = pgs.filter((pg) =>
    pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pg.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPGs = [...filteredPGs].sort((a, b) => {
    if (sortOption === "price") return a.price - b.price;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
        <input
          type="text"
          placeholder="Search PGs by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-3/4 md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort by</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="price">Price (Low to High)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-12 max-w-6xl mx-auto">
        {sortedPGs.length > 0 ? (
          sortedPGs.map((pg) => (
            <div key={pg._id} className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
              <Link to={`/pgs/${pg._id}`}>
                <img 
                  src={pg.images?.[0] || "https://via.placeholder.com/300"} 
                  alt={pg.name} 
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => e.target.src = "https://via.placeholder.com/300"}
                />
              </Link>
              <h3 className="text-2xl font-semibold mt-4">
                <Link to={`/pgs/${pg._id}`} className="text-blue-600 hover:underline">
                  {pg.name}
                </Link>
              </h3>
              <p className="text-gray-700">
                {pg.location?.address || "Address not available"}, {pg.location?.city || "City not available"}
              </p>
              <p className="text-gray-800 font-bold mt-2">₹{pg.price}/month</p>
              <p className="text-yellow-500 mt-2">⭐ {pg.rating} / 5</p>
              <Link to={`/pgs/${pg._id}`} className="block mt-4 text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No PGs found.</p>
        )}
      </div>
    </div>
  );
};

export default ExplorePG;