function CloseIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      stroke-width="2"
    >
      <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path>
    </svg>
  );
}

export default CloseIcon;
