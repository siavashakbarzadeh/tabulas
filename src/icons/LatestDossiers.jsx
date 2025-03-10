function LatestDossiers({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Folder */}
      <path
        d="M3 6C3 4.9 3.9 4 5 4H9L11 6H19C20.1 6 21 6.9 21 8V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6Z"
        fill="white"
      />

      {/* Paper inside folder */}
      <path
        d="M7 9H17V10.5H7V9ZM7 12H14V13.5H7V12ZM7 15H17V16.5H7V15Z"
        opacity="0.6"
        fill="white"
      />

      {/* Clock symbol for "latest" */}
      <circle cx="18" cy="18" r="4" fill="white" opacity="0.8" />
      <path d="M18 16V18.5L19.5 19" stroke="black" strokeWidth="1" />

    </svg>
  );
}

export default LatestDossiers;
