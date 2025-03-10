function LatestActs({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document */}
      <path
        d="M6 3C5.45 3 5 3.45 5 4V20C5 20.55 5.45 21 6 21H18C18.55 21 19 20.55 19 20V8L14 3H6Z"
        fill="white"
      />
      
      {/* Document Text Lines */}
      <path
        d="M8 9H14V10.5H8V9ZM8 12H16V13.5H8V12ZM8 15H16V16.5H8V15Z"
        opacity="0.6"
        fill="white"
      />

      {/* Clock Symbol for "latest" */}
      <circle cx="18" cy="18" r="4" fill="white" opacity="0.8" />
      <path d="M18 16V18.5L19.5 19" stroke="black" strokeWidth="1" />
    </svg>
  );
}

export default LatestActs;
