import React, { useState } from "react";

const DatePicker = ({ saver }) => {
  const [date, setDate] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleDateChange = (e) => {
    const input = e.target.value;
    setDate(input);
    saver(["date", input]);
  };
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex items-center w-screen mb-8">
      <div className="mt-2 bg-white  rounded-md w-full flex items-center justify-center">
        <div className="w-56"></div>
        <label className="pr-8">Select schedule date: </label>
        <input
          type="date"
          name="date"
          className=" w-44 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={handleDateChange}
          min={getTodayDate()}
        />
        <div className=" w-5/12"></div>
      </div>
    </div>
  );
};

export default DatePicker;
