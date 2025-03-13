import React from "react";

function TextInput({
  id,
  onChange,
  label = null,
  value = "",
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
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 rounded-md text-sm bg-white border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0"
      />
      {error_message && (
        <span className="text-red-700 text-sm mt-1">{error_message}</span>
      )}
    </>
  );
}

export default TextInput;
