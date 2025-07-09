import React, { useEffect, useState } from 'react';
import DisplayUsers from './DisplayUsers';

const FetchUsers = () => {
   const [users, setUsers] = useState([{username:"",email:""}]);
   const fetchUsers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/fetch`, requestOptions);
      const data = await response.json();
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  useEffect(()=>{fetchUsers()},[])
  return (<>
    <div className="grid grid-cols-1 bg-gray-600 sm:grid-cols-2 md:grid-cols-3 gap-6 p-30">
      {users.length !== 0 ? (
        users.map((user, index) => (
          <div key={user.email}>
             <DisplayUsers key={user.email|index} user={user} /> 
          </div>
        ))
      ) : (
        "Nothing to display"
      )}
    </div>
    </>
  );
};

export default FetchUsers;
