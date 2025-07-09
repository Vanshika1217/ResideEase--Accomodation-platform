import React from "react";

const Alert = (props) => {
    if(!props.alert)
        return null;
  const colorClass = props.color === "green"
    ? "text-green-800 bg-green-50 dark:text-green-400"
    : props.color === "red"
    ? "text-red-800 bg-red-50 dark:text-red-400"
    : "text-blue-800 bg-blue-50 dark:text-blue-400"; // Default color

  return (
    <div className={`p-4 mb-4 text-sm rounded-lg ${colorClass}`} role="alert">
      <span className="font-medium">{props.type}</span> {props.msg}
    </div>
  );
};

export default Alert;
