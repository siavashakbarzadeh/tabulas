function Ebooks({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* First Book (Back) */}
      <path
        d="M4 2C3.45 2 3 2.45 3 3V19C3 19.55 3.45 20 4 20H14C14.55 20 15 19.55 15 19V3C15 2.45 14.55 2 14 2H4Z"
        fill="white"
      />

      {/* Second Book (Middle) */}
      <path
        d="M6 4C5.45 4 5 4.45 5 5V21C5 21.55 5.45 22 6 22H16C16.55 22 17 21.55 17 21V5C17 4.45 16.55 4 16 4H6Z"
        opacity="0.6"
        fill="white"
      />

      {/* Third Book (Front) */}
      <path
        d="M8 6C7.45 6 7 6.45 7 7V23C7 23.55 7.45 24 8 24H18C18.55 24 19 23.55 19 23V7C19 6.45 18.55 6 18 6H8Z"
        opacity="0.8"
        fill="white"
      />

      {/* Text lines on the books */}
      <path
        d="M9 9H17V10.5H9V9ZM9 12H17V13.5H9V12ZM9 15H17V16.5H9V15Z"
        opacity="0.4"
        fill="white"
      />
    </svg>
  );
}

export default Ebooks;
