import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Kiosk Layout - Fullscreen immersive mode for public displays
 * - No sidebar navigation
 * - Fullscreen mode
 * - All links open within app (no new tabs)
 * - Auto-logout after inactivity (optional)
 */
function KioskLayout() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Intercept all link clicks to open within app
  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        const url = new URL(link.href, window.location.origin);
        
        // If it's an external link, prevent default and open in iframe or same window
        if (url.origin !== window.location.origin) {
          e.preventDefault();
          // For kiosk mode, we'll open external links in a modal or same window
          // For now, just navigate to an embedded view or warn
          console.log('[Kiosk] External link intercepted:', link.href);
          // Open in same window for kiosk mode
          window.location.href = link.href;
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, []);

  // Track user activity for auto-logout
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    window.addEventListener('keydown', updateActivity);
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, []);

  // Enter fullscreen mode
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  // Exit kiosk mode
  const exitKioskMode = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    navigate('/assemblea');
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Kiosk header bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#97002D] flex items-center justify-between px-4 z-50 shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 800 800" 
            fill="white"
          >
            <path d="m498.889,798.925c-25.093-1.948-43.801-4.778-66.173-10.01-10.753-2.515-34.215-7.513-52.136-11.107-18.115-3.633-57.085-12.719-87.755-20.46-81.182-20.491-99.439-23.929-131.979-24.854-17.328-.493-37.401.671-40.103,2.325-.363.222.209,2.206,1.271,4.409,4.272,8.861,3.416,17.157-2.463,23.867-8.946,10.211-25.557,9.544-31.126-1.249-2.561-4.964-3.343-15.913-1.585-22.205,3.731-13.356,17.78-22.161,41.637-26.097,8.431-1.391,15.311-1.555,44.561-1.066,19.025.318,35.793.863,37.263,1.21,2.599.614,2.695.47,3.509-5.247,1.305-9.17.962-44.081-.517-52.602-2.952-17.008-10.695-42.424-14.522-47.67-1.262-1.729-2.178-1.381-15.292,5.813-32.375,17.761-73.226,27.947-106.191,26.48-27.25-1.213-46.442-9.966-60.578-27.627-19.626-24.522-22.287-62.552-6.257-89.436,10.563-17.716,25.036-29.417,43.775-35.391,10.616-3.385,32.073-3.894,48.126-1.142,30.931,5.303,60.75,16.567,114.03,43.074l40.838,20.317,28.343-29.654c15.589-16.31,28.446-29.97,28.573-30.356.127-.386-6.811-4.319-15.416-8.74-29.439-15.125-61.787-35.809-85.076-54.401-15.093-12.049-39.532-36.781-49.272-49.862-24.881-33.416-35.583-65.176-34.109-101.218,1.435-35.066,14.01-66.818,40.521-102.313,10.249-13.722,31.739-36.164,30.959-32.33-.281,1.382-1.028,8.164-1.66,15.072-3.715,40.615,8.743,81.596,35.942,118.23,8.471,11.409,32.798,35.892,46.217,46.514,29.434,23.297,65.345,43.537,105.047,59.205l5.203,2.053,4.582-6.434c5.452-7.657,6.316-9.565,4.331-9.565-5.833,0-65.854-34.49-91.508-52.583-42.986-30.317-72.783-64.436-85.267-97.634-11.527-30.653-6.794-85.118,10.565-121.566,10.156-21.325,31.363-45.549,51.642-58.986,50.528-33.483,122.182-44.1,195.01-28.895,31.154,6.504,64.016,19.537,85.743,34.003,15.355,10.224,54.125,43.918,58.722,51.033,1.396,2.16,1.584,2.058,12.446-6.741,18.637-15.098,38.174-25.769,55.146-30.119,29.907-7.665,66.831,5.96,88.265,32.571,12.043,14.952,17.49,30.395,17.503,49.625,0,5.694-.7,13.606-1.563,17.584-2.146,9.883-10.954,27.442-19.252,38.378-31.975,42.143-73.893,39.006-117.75-8.811-20.058-21.87-28.925-30.167-36.455-34.113-3.898-2.043-8.861-3.993-11.029-4.334l-3.942-.62-46.622,54.534c-25.642,29.994-47.4,55.519-48.351,56.722l-1.728,2.187,12.256,4.238c38.037,13.154,84.021,33.937,113.521,51.309,47.901,28.207,91.357,63.347,110.937,89.708,14.682,19.766,32.831,62.212,36.483,85.326,2.499,15.815,3.017,43.954,1.079,58.677-5.786,43.958-30.025,104.683-58.508,146.575-41.974,61.734-96.55,96.957-162.655,104.976-11.45,1.389-45.675,1.096-67.202-.575Z" />
          </svg>
          <span className="text-white font-bold text-lg">TABULAS KIOSK</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isFullscreen && (
            <button
              onClick={enterFullscreen}
              className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Schermo intero
            </button>
          )}
          <button
            onClick={exitKioskMode}
            className="px-3 py-1.5 bg-white text-[#97002D] text-sm rounded-lg hover:bg-white/90 transition-colors font-semibold"
          >
            Esci da Kiosk
          </button>
        </div>
      </div>

      {/* Main Content - Full width, no sidebar */}
      <div className="pt-14 min-h-screen">
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default KioskLayout;
