function Ebook({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book cover */}
      <path
        d="M4 3C3.45 3 3 3.45 3 4V20C3 20.55 3.45 21 4 21H16C16.55 21 17 20.55 17 20V4C17 3.45 16.55 3 16 3H4Z"
        fill="white"
      />
      
      {/* Book spine */}
      <path
        d="M18 3H19C19.55 3 20 3.45 20 4V20C20 20.55 19.55 21 19 21H18V3Z"
        opacity="0.6"
        fill="white"
      />
      
      {/* Text lines on the book */}
      <path
        d="M6 6H14V7.5H6V6ZM6 9H14V10.5H6V9ZM6 12H14V13.5H6V12ZM6 15H14V16.5H6V15Z"
        opacity="0.4"
        fill="white"
      />

      {/* Bookmark */}
      <path
        d="M17 3V20H20V3H17Z"
        fill="white"
      />
    </svg>
  );
}

export default Ebook;
