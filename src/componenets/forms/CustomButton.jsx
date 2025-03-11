import React from "react";
import Loading from "../../layout/components/Loading";

function CustomButton({ label, onClick, isLoading = false, disabled = false }) {
  return (
    <>
      {isLoading ? (
        <div className="w-full h-10 rounded-md bg-primary-900/20">
          <Loading />
        </div>
      ) : (
        <button
          onClick={onClick}
          disabled={disabled}
          className="w-full h-10 rounded-md text-sm bg-primary-900 text-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0 disabled:bg-primary-900/20"
        >
          {label}
        </button>
      )}
    </>
  );
}

export default CustomButton;
