import React from 'react';
import Navbar from './Navbar';
import AdminCards from './AdminCards';
import { useAuth } from '../context/AuthContext';
const Admin = () => {
  const {user}=useAuth()
  if (!user) {
    return <div>Access Denied</div>;
  }
  return (
    user.username==="admin"?
    <div>
      {/* Navbar (remains separate without a background change) */}
      <Navbar admin={true} />

      {/* Grey background container for the rest of the page */}
      <div className="! bg-gray-100 min-h-screen flex flex-col items-center">
        
        {/* Cards container */}
        <div className="flex flex-wrap justify-center gap-6 p-6 mt-10">
          <AdminCards title="Users" description="Fetch, Add or Remove Users" />
          <AdminCards title="Hotels" description="Fetch, Add or Remove Hotels" />
          <AdminCards title="Flats" description="Fetch, Add or Remove Flats" />
          <AdminCards title="PGs" description="Fetch, Add or Remove PGs" />
        </div>
      </div>
    </div>:<div>Access Denied</div>
  );
};

export default Admin;
