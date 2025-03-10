function GuideManuals({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Open Book */}
      <path
        d="M3 4C2.45 4 2 4.45 2 5V19C2 19.55 2.45 20 3 20H11C11.55 20 12 19.55 12 19V5C12 4.45 11.55 4 11 4H3Z"
        fill="white"
      />
      <path
        d="M13 4C12.45 4 12 4.45 12 5V19C12 19.55 12.45 20 13 20H21C21.55 20 22 19.55 22 19V5C22 4.45 21.55 4 21 4H13Z"
        fill="white"
        opacity="0.8"
      />

      {/* Left Page Lines */}
      <path d="M4.5 7H9V8H4.5V7ZM4.5 10H9V11H4.5V10ZM4.5 13H9V14H4.5V13Z" fill="black" opacity="0.6" />

      {/* Right Page Title */}
      <path d="M14 7H18V8H14V7Z" fill="black" opacity="0.6" />
      {/* Right Page Lines */}
      <path d="M14 10H19V11H14V10ZM14 13H19V14H14V13Z" fill="black" opacity="0.6" />

    </svg>
  );
}

export default GuideManuals;
