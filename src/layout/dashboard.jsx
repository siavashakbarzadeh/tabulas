import { Outlet } from "react-router-dom";
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
      <div className="w-full dm-h-24 flex lg:hidden fixed bottom-0 inset-x-0 bg-primary-900 z-20">
        <div className="w-1/2 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div
          className="w-1/2 flex items-center justify-center"
          onClick={toggleSidebarClickHandler}
        >
          <AppIcon className="w-6 h-6" />
        </div>
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
