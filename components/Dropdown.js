import React, { useState } from "react";

const Dropdown = ({ def, name, saver, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    saver([name, item]);
    setIsOpen(false);
  };

  // const items = [
  //   { id: 1, label: "Item 1" },
  //   { id: 2, label: "Item 2" },
  //   { id: 3, label: "Item 3" },
  //   { id: 4, label: "Item 4" },
  // ];

  return (
    <div className="relative w-full">
      <button
        className="flex items-center justify-between w-full px-4 my-1 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleDropdown}
      >
        {selectedItem ? selectedItem.label : def}
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.707a1 1 0 0 1 1.414 0L10 10.586l3.293-2.879a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 space-y-1 bg-white border border-gray-300 rounded-md shadow-md">
          {items.map((item) => (
            <li
              key={item.id}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
