import React from "react";
import { FaTrash } from "react-icons/fa"; 
import { useLocation } from "react-router-dom";

const DisplayItems = (props) => {
  const location=useLocation();
  const handleOnRemove=async(id)=>{
    try{
      const requestOptions={
        method:"DELETE",
        headers:{"Content-Type": "application/json"},
        body:{"id":id}
      }
      const response=await fetch(`https://backend-resideease.onrender.com/remove`)
      const data=await response.json()
      console.log(data)
    }
      catch(error)
      {

      }
  }
  return (
    <div>
      <div className="max-w-sm w-full lg:max-w-full lg:flex relative">
        <div
          className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          style={{ backgroundImage: `url(${props.item.images?.[0]})` }}
        ></div>

        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <p className="text-sm text-gray-600 flex items-center">
              <svg
                className="fill-current text-gray-500 w-3 h-3 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
              </svg>
              Members only
            </p>
            <div className="text-gray-900 font-bold text-xl mb-2">{props.item.name}</div>
            <p className="text-gray-700 text-base">Price: {props.item.price}</p>
            <p className="text-gray-700 text-base">
              Location: {props.item?.location?.city || "Bengaluru"}
            </p>
            <div className="text-gray-700 text-base">
              <p className="font-bold">Amenities:</p>
              {props.item.amenities?.map((amenity, index) => (
                <p key={index} className="ml-2">- {amenity}</p>
              ))}
            </div>
          </div>

        
          {location.pathname==="/admin/removeItems"?<div className="flex justify-end mt-2">
            <button onClick={()=>{handleOnRemove(props.item._id)}}
              className="p-2 bg-red-600 hover:bg-red-800 text-white rounded-md"
            >
              <FaTrash size={16} />
            </button>
          </div>:""}
        </div>
      </div>
    </div>
  );
};

export default DisplayItems;
