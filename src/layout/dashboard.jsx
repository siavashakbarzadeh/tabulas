import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar2 from "./sidebar2";
import AppIcon from "../icons/App";
import User from "../icons/User";
import { useState, useEffect } from "react";
import BackToTopButton from "./components/BackToTopButton";
import AccessibilityWidget from "./components/AccessibilityWidget";

function DashboardLayout({ ...props }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const location = useLocation();

  const toggleSidebarClickHandler = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  // On mount, load stored preferences
  useEffect(() => {
    const storedLargeText = localStorage.getItem("access_largeText");
    const storedHighContrast = localStorage.getItem("access_highContrast");
    if (storedLargeText === "true") setLargeText(true);
    if (storedHighContrast === "true") setHighContrast(true);
  }, []);

  // Store accessibility toggles
  useEffect(() => {
    localStorage.setItem("access_largeText", largeText.toString());
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem("access_highContrast", highContrast.toString());
  }, [highContrast]);

  return (
    <div
      className={`
        min-h-screen flex w-full bg-primary-900 pb-12 lg:pb-0
        ${highContrast ? "wcag-aa" : ""}
        ${largeText ? "wcag-aa-large-text" : ""}
      `}
    >



      {/* Sidebar */}
      <Sidebar2
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />

      {/* Main Content */}
      <div className="flex w-full pl-0 lg:pl-68">
        <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
          <Outlet />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="w-full h-16 flex lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-20 safe-area-bottom">
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${
            location.pathname === '/' || location.pathname === '/assemblea' 
              ? 'text-red-800' 
              : 'text-gray-500'
          }`}
          onClick={() => setIsSidebarActive(false)}
        >
          <i className="fa-duotone fa-house text-lg" aria-hidden="true"></i>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          to="/commissioni"
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${
            location.pathname === '/commissioni' 
              ? 'text-red-800' 
              : 'text-gray-500'
          }`}
          onClick={() => setIsSidebarActive(false)}
        >
          <i className="fa-duotone fa-users text-lg" aria-hidden="true"></i>
          <span className="text-[10px] font-medium">Commissioni</span>
        </Link>
        <Link
          to="/ultimdossier"
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${
            location.pathname === '/ultimdossier' 
              ? 'text-red-800' 
              : 'text-gray-500'
          }`}
          onClick={() => setIsSidebarActive(false)}
        >
          <i className="fa-duotone fa-file-lines text-lg" aria-hidden="true"></i>
          <span className="text-[10px] font-medium">Dossier</span>
        </Link>
        <button
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${
            isSidebarActive ? 'text-red-800' : 'text-gray-500'
          }`}
          onClick={toggleSidebarClickHandler}
        >
          <i className={`fa-duotone ${isSidebarActive ? 'fa-xmark' : 'fa-bars'} text-lg`} aria-hidden="true"></i>
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>

      {/* Utilities */}
      <BackToTopButton />
      <AccessibilityWidget
        largeText={largeText}
        setLargeText={setLargeText}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />
    </div>
  );
}

export default DashboardLayout;
