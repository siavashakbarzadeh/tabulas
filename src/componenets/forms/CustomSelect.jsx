import React from "react";

function CustomSelect({
  id,
  options = [],
  onChange,
  label = null,
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
        className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
      >
        <option value="DDL 1">DDL 1</option>
        <option value="DDL 2">DDL 2</option>
        <option value="DDL 3">DDL 3</option>
      </select>
    </>
  );
}

export default CustomSelect;
