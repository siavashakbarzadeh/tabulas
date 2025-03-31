import { Outlet } from "react-router-dom";
import Sidebar2 from "./sidebar2";
import AppIcon from "../icons/App";
import User from "../icons/User";
import { useState } from "react";
import BackToTopButton from "./components/BackToTopButton"
import AccessibilityWidget from "./components/AccessibilityWidget"; // or similar
; // Adjust path as needed

function DashboardLayout({ ...props }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebarClickHandler = (event) => {
    setIsSidebarActive((prevSatate) => !prevSatate);
  };

  return (
    <div
      className={`min-h-screen ${largeText ? "text-xl leading-7" : ""
        } ${highContrast ? "aa" : ""}`}
    >
      <div className="flex w-full bg-primary-900 pb-12 lg:pb-0">
        <Sidebar2 isSidebarActive={isSidebarActive} />
        <div className="flex w-full pl-0 lg:pl-68">
          <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
            <Outlet />
          </div>
        </div>
        <div className="w-full h-12 flex lg:hidden fixed bottom-0 inset-x-0 bg-primary-900 z-20">
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
        {/* Back to Top Button */}
        <BackToTopButton />
        <AccessibilityWidget
          largeText={largeText}
          setLargeText={setLargeText}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
        />
      </div>
    </div>
  );
}

export default DashboardLayout;
