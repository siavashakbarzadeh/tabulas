import React from "react";

function CustomSelect({
  id,
  options = [],
  onChange,
  label = null,
  value = null,
  error_message = "",
  placeholder = "",
}) {
  return (
    <>
      {label && (
        <label htmlFor={id} className="text-sm text-zinc-900 mb-1 font-medium">
          {label}
        </label>
      )}
      <select
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
      >
        <option value={null} disabled>Choose an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error_message && (
        <span className="text-red-700 text-sm mt-1">{error_message}</span>
      )}
    </>
  );
}

export default CustomSelect;
