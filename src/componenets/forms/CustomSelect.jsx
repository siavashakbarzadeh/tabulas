import React from "react";

function CustomSelect({
  id,
  options = [],
  label = null,
  value = "",
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
        value={value}
        placeholder={placeholder}
        className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
      >
        {options.map((option, key) => (
          <option key={key} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

export default CustomSelect;
