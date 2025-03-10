function Ebook({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 2C3.89 2 3 2.89 3 4V20C3 21.11 3.89 22 5 22H19C20.11 22 21 21.11 21 20V4C21 2.89 20.11 2 19 2H5Z"
        fill="white"
      />
      <path
        d="M7 6H17V8H7V6ZM7 10H14V12H7V10ZM7 14H17V16H7V14Z"
        opacity="0.6"
        fill="white"
      />
      <path
        d="M19 2H5C3.89 2 3 2.89 3 4V20C3 21.11 3.89 22 5 22H19C20.11 22 21 21.11 21 20V4C21 2.89 20.11 2 19 2ZM19 20H5V4H19V20Z"
        opacity="0.4"
        fill="white"
      />
    </svg>
  );
}

export default Ebook;
