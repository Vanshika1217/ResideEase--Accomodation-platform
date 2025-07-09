import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PortalLogin from "./pages/Login.jsx";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import ExploreHotels from "./pages/ExploreHotels";
import ExplorePG from "./pages/ExplorePG";
import Admin from "./components/Admin";
import Fetch from "./components/Fetch";
import {FetchProvider} from "./context/FetchContext";
import HotelDetailPage from "./pages/HotelDetails"
// import { AuthProvider } from "./context/AuthContext";
import PGDetailPage from "./pages/PGDetails";
import Booking from "./pages/BookingConfirmed";
import BookNow from "./pages/BookNow";

import ChatApp from "./components/ChatApp.jsx";
// import Xo from "./pages/Xo";
import AddItem from "./components/AddItem";
import AddUser from "./components/AddUser";
import RemoveUser from "./components/RemoveUser.jsx"
import FetchUsers from "./components/FetchUsers.jsx";
import ProfilePage from "./pages/ProfilePage.jsx"
import FetchBookings from "./components/FetchBookings.jsx";
import CancelBookings from "./components/CancelBookings.jsx";
import BookPG from "./pages/PGbook";
import UPIPayment from "./pages/UPIPayment.jsx";
import PGBookingConfirmed from "./pages/PGBookingConfirmed.jsx";
import PGUPIPayment from "./pages/PGUPIPayment"; 
function App() {
  return (
    <>
    <FetchProvider>
    <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PortalLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/fetchBookings" element={<FetchBookings />} />
          <Route path="/cancelBookings" element={<CancelBookings />} />
          <Route path="/explore-hotels" element={<ExploreHotels />} />
          <Route path="/explore-pgs" element={<ExplorePG />} />
          <Route path="/hotels/:hotelId"  element={<HotelDetailPage/>}/>
          <Route path="/admin/fetchItems" element={<Fetch />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pgs/:pgId" element={<PGDetailPage/>} />
          <Route path="/booknow" element={<BookNow/>} />
          <Route path="/booking-confirmed" element={<Booking/>} />
          {/* <Route path="/Xo" element={<Xo/>} /> */}
          <Route path="/admin/fetchItems" element={<Fetch tag={1}/>} />
          <Route path="/admin/removeItems" element={<Fetch tag={2} />} />
          <Route path="/admin/addItem" element={<AddItem />} />
          <Route path="/admin/addUser" element={<AddUser />} />
          <Route path="/admin/removeUser" element={<RemoveUser />} />
          <Route path="/admin/fetchUsers" element={<FetchUsers />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pgnow" element={<BookPG />} />
          <Route path="/payment" element={<UPIPayment/>}/>
<Route path='/chat' element ={<ChatApp/>}/>
<Route path="/pg-booking-confirmed" element={<PGBookingConfirmed />} />
<Route path="/pg-upi-payment" element={<PGUPIPayment />} />
          
        </Routes>
     </FetchProvider>
      </>
  );
}

export default App;