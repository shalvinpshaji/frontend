import React, { useState } from "react";

const FailureAlert = ({ message, duration, type }) => {
  const [showAlert, setShowAlert] = useState(true);
  let alertTypeClasses = "";
  if (!showAlert) {
    return null;
  }
  if (type === "success") {
    alertTypeClasses = "bg-green-500 text-white";
  } else if (type === "failure") {
    alertTypeClasses = "bg-red-500 text-white";
  }

  return (
    <div
      className={`fixed top-0 right-0 m-4 p-4 text-white rounded-md ${alertTypeClasses}`}
    >
      {message}
    </div>
  );
};

export default FailureAlert;
