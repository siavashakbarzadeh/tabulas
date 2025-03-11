import React from "react";

function CustomButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-10 rounded-md text-sm bg-primary-900 text-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
    >
      {label}
    </button>
  );
}

export default CustomButton;
