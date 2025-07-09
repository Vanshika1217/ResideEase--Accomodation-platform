import React, { useState,useEffect } from 'react';
import Navbar from './Navbar';
import Alert from './Alert';

const AddUser = () => {
  const [alert,setAlert]=useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try{
        let obj={
            email:formData.email
           }
    const response = await fetch("https://backend-resideease.onrender.com/user/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
  });

  const data = await response.json();
 console.log(data)
  if (data.message!==undefined)  
  {
   
    await  setAlert(true);
    if(alert)
    setTimeout(()=>{setAlert(null)},2000);
  }
  else
  {
    await setAlert(null);
  }

  
}
  catch(error)
  {
    console.error("Error submitting form:", error);
  }
  };
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 2000);
      return () => clearTimeout(timer); // Cleanup function to avoid memory leaks
    }
  }, [alert]);


  return (
    <>
    <Navbar admin={true}/>
    <Alert alert={alert} color={"green"} type={"Success"} msg={"User Removed successfully"}/>
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
      <div className="bg-white p-35 rounded-lg shadow-md w-248">
        <h1 className="text-5xl font-bold mb-12 text-center text-gray-700">Remove User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-6 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddUser;
