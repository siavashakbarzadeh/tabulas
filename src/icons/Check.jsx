function CheckIcon({ className = "" }) {
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
      <path d="M5 12l5 5l10 -10"></path>
    </svg>
  );
}

export default CheckIcon;
