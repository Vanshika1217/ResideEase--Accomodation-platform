import React, { useEffect, useState } from 'react';
import DisplayItems from './DisplayItems';
import RemoveItems from './RemoveItems';
import { useFetch } from '../context/FetchContext';

const Fetch = (props) => {
  const { param } = useFetch();
  const [items, setItems] = useState([{ _id: "-1", price: 0, location: "x", img: "default" }]);

  const fetchItems = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch(`${import.meta.env.VITE_API_URL}fetch/${param}`, requestOptions);
      const data = await response.json();
      setItems(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [param]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-30">
      {items.length !== 0 ? (
        items.map((item, index) => (
          <div key={item._id || index}>
            {props.tag === 1 ? <DisplayItems key={item._id|index}item={item} /> : <RemoveItems key={item._id|index} item={item} />}
          </div>
        ))
      ) : (
        "Nothing to display"
      )}
    </div>
  );
};

export default Fetch;
