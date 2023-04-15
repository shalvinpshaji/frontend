import React, { useState } from "react";

const TimePicker = ({ saver }) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const handleHourChange = (e) => {
    const { value } = e.target;
    // Limit hour input to 0-23
    if (value === "" || (value >= 0 && value <= 23)) {
      setHour(value);
      saver(["hour", value]);
    }
  };

  const handleMinuteChange = (e) => {
    const { value } = e.target;
    // Limit minute input to 0-59
    if (value === "" || (value >= 0 && value <= 59)) {
      setMinute(value);
      saver(["minute", value]);
    }
  };

  return (
    <div className="flex w-full space-x-2 my-8">
      <div className="w-1/4"></div>
      <label>Select schedule time: </label>
      <input
        name="hour"
        type="number"
        className="flex-1 p-2 text-center bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Hour (0-23)"
        value={hour}
        onChange={handleHourChange}
      />
      <input
        name="minute"
        type="number"
        className="flex-1 p-2 text-center bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Minute (0-59)"
        value={minute}
        onChange={handleMinuteChange}
      />
      <div className="w-1/4"></div>
    </div>
  );
};

export default TimePicker;
