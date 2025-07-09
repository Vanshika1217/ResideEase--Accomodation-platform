import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import hotelsImg from "../assets/hotels.jpeg";
import flatsImg from "../assets/hotels2.jpg";
import pgsImg from "../assets/flats.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // Navigation Hook

  const carouselItems = [
    {
      title: "Find the Best PGs",
      description: "Affordable and verified PG accommodations.",
      image: hotelsImg,
    },
    {
      title: "Discover Flats",
      description: "Furnished and semi-furnished flats available.",
      image: flatsImg,
    },
    {
      title: "Luxury Hotels",
      description: "Top-rated hotels for a comfortable stay.",
      image: pgsImg,
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <h1 className="text-5xl font-extrabold text-gray-600 mb-4">
          Find Your Perfect Stay
        </h1>
        <p className="text-gray-700 max-w-2xl">
          Explore the best accommodations including PGs, flats, and hotels, all
          in one place.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="relative w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <img
          src={carouselItems[currentIndex].image}
          alt={carouselItems[currentIndex].title}
          className="w-full h-64 object-cover rounded-lg"
        />

        <div className="text-center mt-4">
          <h2 className="text-3xl font-bold text-gray-900">
            {carouselItems[currentIndex].title}
          </h2>
          <p className="text-gray-800 mt-2">
            {carouselItems[currentIndex].description}
          </p>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Explore Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => navigate("/explore-pgs")}
          className="bg-blue-300 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-500 transition shadow-lg"
        >
          Explore PGs & Flats
        </button>
        <button
          onClick={() => navigate("/explore-hotels")}
          className="bg-green-300 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-500 transition shadow-lg"
        >
          Explore Hotels
        </button>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12 max-w-6xl mx-auto">
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900">
            Verified Listings
          </h3>
          <p className="mt-2">
            All accommodations are verified for safety and security.
          </p>
        </div>
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900">
            Budget-Friendly
          </h3>
          <p className="mt-2">
            Find options that suit your budget, from affordable PGs to luxury
            hotels.
          </p>
        </div>
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900">Easy Booking</h3>
          <p className="mt-2">
            Instantly book your stay with our seamless online process.
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
