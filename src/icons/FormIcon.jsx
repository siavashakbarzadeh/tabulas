function FormIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document Shape */}
      <path
        d="M6 3C5.45 3 5 3.45 5 4V20C5 20.55 5.45 21 6 21H18C18.55 21 19 20.55 19 20V8L14 3H6Z"
        fill="white"
      />

      {/* Form Fields - Lines */}
      <path d="M8 8H16V9.5H8V8Z" fill="black" opacity="0.6" />
      <path d="M8 11H14V12.5H8V11Z" fill="black" opacity="0.6" />
      <path d="M8 14H12V15.5H8V14Z" fill="black" opacity="0.6" />

      {/* Checkbox */}
      <rect x="15" y="13.5" width="3" height="3" fill="black" opacity="0.8" />
    </svg>
  );
}

export default FormIcon;
