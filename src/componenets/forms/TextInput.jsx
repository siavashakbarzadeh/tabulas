import React from "react";

function TextInput({
  id,
  onChange,
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
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
      />
      <span className="text-red-700 text-sm mt-1">this is an error</span>
    </>
  );
}

export default TextInput;
