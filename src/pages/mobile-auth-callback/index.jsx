import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Mobile Auth Callback Page
 * Shows after login - allows user to choose how to continue
 */
function MobileAuthCallback() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const extractToken = () => {
      console.log('[MobileAuthCallback] Extracting token');
      
      // Try to get token from various sources
      const searchParams = new URLSearchParams(window.location.search);
      let accessToken = searchParams.get('token');
      
      // Check URL hash (OAuth implicit flow)
      if (!accessToken && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        accessToken = hashParams.get('access_token');
        
        const hashError = hashParams.get('error');
        if (hashError) {
          const errorDesc = hashParams.get('error_description') || 'Login fallito';
          setError(decodeURIComponent(errorDesc));
          setIsLoading(false);
          return;
        }
      }
      
      // Check localStorage
      if (!accessToken) {
        accessToken = localStorage.getItem('mobileAuthToken');
      }
      if (!accessToken) {
        accessToken = localStorage.getItem('auth-token');
      }
      
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem('mobileAuthToken', accessToken);
        localStorage.setItem('auth-token', accessToken);
      } else {
        setError('Nessun token trovato. Riprova il login.');
      }
      
      setIsLoading(false);
    };

    extractToken();
  }, []);

  const handleReturnToApp = () => {
    if (!token) {
      setError('Token non disponibile');
      return;
    }

    localStorage.removeItem('mobileAuthToken');
    localStorage.removeItem('mobileAuthPending');

    const deepLinkUrl = `tabulas://auth?token=${encodeURIComponent(token)}`;
    window.location.href = deepLinkUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#97002D]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          <p className="text-white">Elaborazione login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#97002D]">
        <div className="text-center text-white px-6">
          <div className="mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Errore</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white text-[#97002D] rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Torna al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#97002D]">
      <div className="flex flex-col items-center text-center px-6 w-full max-w-md">
        {/* Senato Logo */}
        <div className="mb-6">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 800 800" 
            fill="white"
            className="drop-shadow-lg"
          >
            <path d="m498.889,798.925c-25.093-1.948-43.801-4.778-66.173-10.01-10.753-2.515-34.215-7.513-52.136-11.107-18.115-3.633-57.085-12.719-87.755-20.46-81.182-20.491-99.439-23.929-131.979-24.854-17.328-.493-37.401.671-40.103,2.325-.363.222.209,2.206,1.271,4.409,4.272,8.861,3.416,17.157-2.463,23.867-8.946,10.211-25.557,9.544-31.126-1.249-2.561-4.964-3.343-15.913-1.585-22.205,3.731-13.356,17.78-22.161,41.637-26.097,8.431-1.391,15.311-1.555,44.561-1.066,19.025.318,35.793.863,37.263,1.21,2.599.614,2.695.47,3.509-5.247,1.305-9.17.962-44.081-.517-52.602-2.952-17.008-10.695-42.424-14.522-47.67-1.262-1.729-2.178-1.381-15.292,5.813-32.375,17.761-73.226,27.947-106.191,26.48-27.25-1.213-46.442-9.966-60.578-27.627-19.626-24.522-22.287-62.552-6.257-89.436,10.563-17.716,25.036-29.417,43.775-35.391,10.616-3.385,32.073-3.894,48.126-1.142,30.931,5.303,60.75,16.567,114.03,43.074l40.838,20.317,28.343-29.654c15.589-16.31,28.446-29.97,28.573-30.356.127-.386-6.811-4.319-15.416-8.74-29.439-15.125-61.787-35.809-85.076-54.401-15.093-12.049-39.532-36.781-49.272-49.862-24.881-33.416-35.583-65.176-34.109-101.218,1.435-35.066,14.01-66.818,40.521-102.313,10.249-13.722,31.739-36.164,30.959-32.33-.281,1.382-1.028,8.164-1.66,15.072-3.715,40.615,8.743,81.596,35.942,118.23,8.471,11.409,32.798,35.892,46.217,46.514,29.434,23.297,65.345,43.537,105.047,59.205l5.203,2.053,4.582-6.434c5.452-7.657,6.316-9.565,4.331-9.565-5.833,0-65.854-34.49-91.508-52.583-42.986-30.317-72.783-64.436-85.267-97.634-11.527-30.653-6.794-85.118,10.565-121.566,10.156-21.325,31.363-45.549,51.642-58.986,50.528-33.483,122.182-44.1,195.01-28.895,31.154,6.504,64.016,19.537,85.743,34.003,15.355,10.224,54.125,43.918,58.722,51.033,1.396,2.16,1.584,2.058,12.446-6.741,18.637-15.098,38.174-25.769,55.146-30.119,29.907-7.665,66.831,5.96,88.265,32.571,12.043,14.952,17.49,30.395,17.503,49.625,0,5.694-.7,13.606-1.563,17.584-2.146,9.883-10.954,27.442-19.252,38.378-31.975,42.143-73.893,39.006-117.75-8.811-20.058-21.87-28.925-30.167-36.455-34.113-3.898-2.043-8.861-3.993-11.029-4.334l-3.942-.62-46.622,54.534c-25.642,29.994-47.4,55.519-48.351,56.722l-1.728,2.187,12.256,4.238c38.037,13.154,84.021,33.937,113.521,51.309,47.901,28.207,91.357,63.347,110.937,89.708,14.682,19.766,32.831,62.212,36.483,85.326,2.499,15.815,3.017,43.954,1.079,58.677-5.786,43.958-30.025,104.683-58.508,146.575-41.974,61.734-96.55,96.957-162.655,104.976-11.45,1.389-45.675,1.096-67.202-.575Z" />
          </svg>
        </div>

        {/* Success Icon */}
        <div className="text-green-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Login Effettuato!
        </h1>
        
        <p className="text-white/80 mb-8">
          Scegli come continuare:
        </p>

        {/* Return to App Button */}
        <button
          onClick={handleReturnToApp}
          className="w-full px-6 py-4 bg-white text-[#97002D] text-lg rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg mb-4 flex items-center justify-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Torna all'App
        </button>

        {/* Continue in Browser Button with Dropdown */}
        <div className="w-full relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-6 py-4 bg-white/20 text-white text-lg rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Continua nel browser
            <svg className={`h-5 w-5 ml-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-10">
              <button
                onClick={() => navigate('/assemblea')}
                className="w-full px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition-colors flex items-center border-b border-gray-100"
              >
                <svg className="h-5 w-5 mr-3 text-[#97002D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-semibold">Versione App</div>
                  <div className="text-sm text-gray-500">Interfaccia standard con menu</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/assemblea?mode=kiosk')}
                className="w-full px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition-colors flex items-center"
              >
                <svg className="h-5 w-5 mr-3 text-[#97002D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <div>
                  <div className="font-semibold">Versione Kiosk</div>
                  <div className="text-sm text-gray-500">Schermo intero per totem</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileAuthCallback;
