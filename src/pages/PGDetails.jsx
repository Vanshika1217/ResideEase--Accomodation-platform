import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaWifi, FaSwimmer, FaSpa, FaUtensils, FaParking, FaDumbbell } from "react-icons/fa";
import axios from "axios";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import Carousel from "../components/Carousel";

const iconMapping = {
  "Free WiFi": <FaWifi className="text-blue-500 text-2xl" />,
  "Swimming Pool": <FaSwimmer className="text-blue-500 text-2xl" />,
  "Spa": <FaSpa className="text-blue-500 text-2xl" />,
  "Restaurant": <FaUtensils className="text-blue-500 text-2xl" />,
  "Parking": <FaParking className="text-blue-500 text-2xl" />,
  "Fitness Center": <FaDumbbell className="text-blue-500 text-2xl" />
};

export default function PGDetailPage() {
  const { pgId } = useParams();
  const navigate = useNavigate();
  const [pg, setPgs] = useState(null);
  const [userLocation, setUserLocation] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [map, setMap] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/accommodations/pgs/${pgId}`)
      .then(response => setPgs(response.data))
      .catch(error => console.error("Error fetching pgs details:", error));
  }, [pgId]);

  const handleBookNow = () => {
    if (!pg) return;
    navigate("/pgnow", {
      state: {
        pgName: pg.name,
        pgId: pg._id,
        location: pg.location,
        price: pg.price,
        rentRange: pg.rentRange || "5000 - 8000",
        amenities: pg.amenities,
        img: pg.images
      }
    });
  };

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lon: longitude });

      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      setUserAddress(res.data.display_name);
    }, () => {
      alert("Unable to retrieve your location");
    });
  };

  const calculateRoute = async () => {
    if (!pg || !pg.location || !userLocation) return;

    const { latitude: pgLat, longitude: pgLon } = pg.location;
    const { lat, lon } = userLocation;

    if (routingControl) {
      map.removeControl(routingControl);
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(lat, lon), L.latLng(pgLat, pgLon)],
      routeWhileDragging: true,
    }).addTo(map);

    setRoutingControl(control);

    control.on("routesfound", function (e) {
      const route = e.routes[0];
      setRouteInfo({
        distance: (route.summary.totalDistance / 1000).toFixed(2),
        time: (route.summary.totalTime / 60).toFixed(0),
      });
    });
  };

  useEffect(() => {
    if (pg && pg.location) {
      const { latitude, longitude } = pg.location;

      const mapInstance = L.map('map').setView([latitude, longitude], 13);
      setMap(mapInstance);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      L.marker([latitude, longitude]).addTo(mapInstance)
        .bindPopup(`<b>${pg.name}</b><br>${pg.location.address}`)
        .openPopup();
    }
  }, [pg]);

  const handleLocationSubmit = async () => {
    if (!pg || !pg.location) return;

    let lat, lon;

    if (userLocation.includes(",")) {
      [lat, lon] = userLocation.split(",").map(coord => parseFloat(coord.trim()));
    } else {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${userLocation}`);
      const data = await res.json();
      if (data.length > 0) {
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      } else {
        alert("Location not found! Enter a valid place name or coordinates.");
        return;
      }
    }

    const { latitude: pgLat, longitude: pgLon } = pg.location;

    if (routingControl) {
      map.removeControl(routingControl);
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(lat, lon), L.latLng(pgLat, pgLon)],
      routeWhileDragging: true
    }).addTo(map);

    setRoutingControl(control);

    control.on('routesfound', function (e) {
      const route = e.routes[0];
      setRouteInfo({
        distance: (route.summary.totalDistance / 1000).toFixed(2),
        time: (route.summary.totalTime / 60).toFixed(0)
      });
    });
  };

  if (!pg) return <div className="text-center text-gray-600">PG not found</div>;

  return (
    <>
      <Navbar />
      <div className="w-full mx-auto p-6 flex flex-wrap gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-center mb-6">{pg.name}</h1>

          <div className="mb-6">
            <Carousel images={pg.images} />
          </div>
          <p className="text-lg text-gray-700 mb-6">{pg.description}</p>

          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-3 gap-4">
              {pg.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-white shadow rounded-md">
                  {iconMapping[amenity] || <span className="text-gray-600">{amenity}</span>}
                  <span className="text-gray-700 font-medium">{amenity}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleBookNow}
              className="w-full mt-6 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div id="map" style={{ height: '400px', width: '100%' }}></div>

          {userAddress && <p className="text-gray-700 font-medium text-center">{userAddress}</p>}

          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Enter Your Location</h2>
            <button
              onClick={getUserLocation}
              className="w-full bg-gray-700 text-white p-2 rounded-md hover:bg-gray-800 transition mb-3"
            >
              Detect My Location
            </button>
            <button
              onClick={calculateRoute}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Calculate Distance
            </button>

            {routeInfo && (
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">Distance: {routeInfo.distance} km</p>
                <p className="text-lg font-semibold">Estimated Time: {routeInfo.time} mins</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Enter Your Location</h2>
            <input
              type="text"
              placeholder="Enter lat,lon or place name"
              value={typeof userLocation === 'string' ? userLocation : ''}
              onChange={(e) => setUserLocation(e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
            />
            <button
              onClick={handleLocationSubmit}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Calculate Distance
            </button>

            {routeInfo && (
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">Distance: {routeInfo.distance} km</p>
                <p className="text-lg font-semibold">Estimated Time: {routeInfo.time} mins</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
