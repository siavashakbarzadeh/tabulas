import { Outlet, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar2 from "./sidebar2";
import Menu2 from "./sidebar2/Menu";
import { useState, useEffect } from "react";
import BackToTopButton from "./components/BackToTopButton";
import AccessibilityWidget from "./components/AccessibilityWidget";
import { useAuth } from "../contexts/AuthContext";
import { useMsal } from "@azure/msal-react";

function DashboardLayout({ ...props }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [kioskMenuOpen, setKioskMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { instance } = useMsal();
  
  // Check if kiosk mode is enabled via query param
  const isKioskMode = searchParams.get('mode') === 'kiosk';

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

  // Kiosk mode: Auto-fullscreen and intercept links
  useEffect(() => {
    if (isKioskMode) {
      // Auto request fullscreen
      const requestFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        setIsFullscreen(true);
      };
      
      // Request fullscreen after a short delay
      const timeoutId = setTimeout(requestFullscreen, 500);
      
      // Intercept all link clicks to keep ?mode=kiosk
      const handleLinkClick = (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
          const url = new URL(link.href, window.location.origin);
          
          // If it's an internal link, preserve kiosk mode
          if (url.origin === window.location.origin) {
            e.preventDefault();
            url.searchParams.set('mode', 'kiosk');
            navigate(url.pathname + url.search);
            setKioskMenuOpen(false);
          } else {
            // External link - open in same window for kiosk mode
            e.preventDefault();
            window.location.href = link.href;
          }
        }
      };

      document.addEventListener('click', handleLinkClick, true);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleLinkClick, true);
      };
    }
  }, [isKioskMode, navigate]);

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Kiosk mode: Exit handler
  const exitKioskMode = async () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    navigate(location.pathname);
  };

  // Enter fullscreen manually
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  // Logout handler for kiosk
  const handleKioskLogout = async () => {
    try {
      await instance.logoutPopup();
    } catch (e) {
      console.warn("MSAL logout failed:", e);
    }
    logout();
    navigate('/login');
  };

  // Get user initials
  const getInitials = (name, email) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 1).toUpperCase() : 'U';
  };

  // Kiosk Mode Layout
  if (isKioskMode) {
    return (
      <div className={`min-h-screen bg-gray-50 relative ${highContrast ? "wcag-aa" : ""} ${largeText ? "wcag-aa-large-text" : ""}`}>
        {/* Kiosk header bar - minimal */}
        <div className="fixed top-0 left-0 right-0 h-12 bg-[#97002D] flex items-center justify-between px-4 z-50 shadow-lg">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 800 800" fill="white">
              <path d="m498.889,798.925c-25.093-1.948-43.801-4.778-66.173-10.01-10.753-2.515-34.215-7.513-52.136-11.107-18.115-3.633-57.085-12.719-87.755-20.46-81.182-20.491-99.439-23.929-131.979-24.854-17.328-.493-37.401.671-40.103,2.325-.363.222.209,2.206,1.271,4.409,4.272,8.861,3.416,17.157-2.463,23.867-8.946,10.211-25.557,9.544-31.126-1.249-2.561-4.964-3.343-15.913-1.585-22.205,3.731-13.356,17.78-22.161,41.637-26.097,8.431-1.391,15.311-1.555,44.561-1.066,19.025.318,35.793.863,37.263,1.21,2.599.614,2.695.47,3.509-5.247,1.305-9.17.962-44.081-.517-52.602-2.952-17.008-10.695-42.424-14.522-47.67-1.262-1.729-2.178-1.381-15.292,5.813-32.375,17.761-73.226,27.947-106.191,26.48-27.25-1.213-46.442-9.966-60.578-27.627-19.626-24.522-22.287-62.552-6.257-89.436,10.563-17.716,25.036-29.417,43.775-35.391,10.616-3.385,32.073-3.894,48.126-1.142,30.931,5.303,60.75,16.567,114.03,43.074l40.838,20.317,28.343-29.654c15.589-16.31,28.446-29.97,28.573-30.356.127-.386-6.811-4.319-15.416-8.74-29.439-15.125-61.787-35.809-85.076-54.401-15.093-12.049-39.532-36.781-49.272-49.862-24.881-33.416-35.583-65.176-34.109-101.218,1.435-35.066,14.01-66.818,40.521-102.313,10.249-13.722,31.739-36.164,30.959-32.33-.281,1.382-1.028,8.164-1.66,15.072-3.715,40.615,8.743,81.596,35.942,118.23,8.471,11.409,32.798,35.892,46.217,46.514,29.434,23.297,65.345,43.537,105.047,59.205l5.203,2.053,4.582-6.434c5.452-7.657,6.316-9.565,4.331-9.565-5.833,0-65.854-34.49-91.508-52.583-42.986-30.317-72.783-64.436-85.267-97.634-11.527-30.653-6.794-85.118,10.565-121.566,10.156-21.325,31.363-45.549,51.642-58.986,50.528-33.483,122.182-44.1,195.01-28.895,31.154,6.504,64.016,19.537,85.743,34.003,15.355,10.224,54.125,43.918,58.722,51.033,1.396,2.16,1.584,2.058,12.446-6.741,18.637-15.098,38.174-25.769,55.146-30.119,29.907-7.665,66.831,5.96,88.265,32.571,12.043,14.952,17.49,30.395,17.503,49.625,0,5.694-.7,13.606-1.563,17.584-2.146,9.883-10.954,27.442-19.252,38.378-31.975,42.143-73.893,39.006-117.75-8.811-20.058-21.87-28.925-30.167-36.455-34.113-3.898-2.043-8.861-3.993-11.029-4.334l-3.942-.62-46.622,54.534c-25.642,29.994-47.4,55.519-48.351,56.722l-1.728,2.187,12.256,4.238c38.037,13.154,84.021,33.937,113.521,51.309,47.901,28.207,91.357,63.347,110.937,89.708,14.682,19.766,32.831,62.212,36.483,85.326,2.499,15.815,3.017,43.954,1.079,58.677-5.786,43.958-30.025,104.683-58.508,146.575-41.974,61.734-96.55,96.957-162.655,104.976-11.45,1.389-45.675,1.096-67.202-.575Z" />
            </svg>
            <span className="text-white font-bold text-base">TABULAS</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!isFullscreen && (
              <button
                onClick={enterFullscreen}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Schermo intero"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            )}
            <button
              onClick={exitKioskMode}
              className="px-3 py-1.5 bg-white text-[#97002D] text-sm rounded-lg hover:bg-white/90 transition-colors font-semibold"
            >
              Esci
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-12 pb-16 min-h-screen">
          <Outlet />
        </div>

        {/* Footer Sidebar Menu */}
        <div className={`fixed bottom-0 left-0 right-0 bg-[#97002D] z-40 transition-all duration-300 ${kioskMenuOpen ? 'h-auto max-h-[70vh]' : 'h-14'}`}>
          {/* Toggle bar */}
          <div 
            className="h-14 flex items-center justify-between px-4 cursor-pointer"
            onClick={() => setKioskMenuOpen(!kioskMenuOpen)}
          >
            {/* User info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex justify-center items-center rounded-lg bg-white">
                <span className="text-sm font-bold text-zinc-900">
                  {getInitials(user?.name, user?.email)}
                </span>
              </div>
              <div className="text-white">
                <div className="text-sm font-medium">{user?.name || 'Utente'}</div>
              </div>
            </div>

            {/* Menu toggle */}
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm">Menu</span>
              <svg 
                className={`w-5 h-5 text-white transition-transform ${kioskMenuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>

          {/* Expanded menu */}
          {kioskMenuOpen && (
            <div className="px-4 pb-4 overflow-y-auto max-h-[calc(70vh-3.5rem)]">
              <Menu2 onNavigate={() => setKioskMenuOpen(false)} />
              
              {/* Logout button */}
              <button
                onClick={handleKioskLogout}
                className="w-full mt-4 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-3 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Esci dall'account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal Layout
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
