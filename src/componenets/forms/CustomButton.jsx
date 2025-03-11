import React from "react";

function CustomButton({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-10 disabled:bg-primary-900/10 rounded-md text-sm bg-primary-900 text-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
    >
      {label}
    </button>
  );
}

export default CustomButton;
