import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { toast } from "react-toastify";

function NewLoginPage() {
  const [isProcessingAuth, setIsProcessingAuth] = useState(true);
  const { instance, accounts } = useMsal();
  const { login, logout: localLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle MSAL redirect response
   */
  useEffect(() => {
    instance.handleRedirectPromise()
      .then((response) => {
        if (response && response.accessToken) {
          console.log('[Login] Got token from redirect');
          
          const userAgent = navigator.userAgent || '';
          const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent);
          
          if (isMobileDevice) {
            console.log('[Login] Mobile device detected! Redirecting to callback page');
            sessionStorage.removeItem('mobileAuthPending');
            localStorage.removeItem('mobileAuthPending');
            localStorage.setItem('mobileAuthToken', response.accessToken);
            navigate(`/mobile-auth-callback`);
            return;
          }
          
          login(response.accessToken);
          toast.success("Login effettuato con successo!", {
            position: "bottom-right",
            hideProgressBar: true,
          });
          navigate("/");
        } else {
          setIsProcessingAuth(false);
        }
      })
      .catch((error) => {
        console.error('[Login] Redirect error:', error);
        localStorage.removeItem('mobileAuthPending');
        setIsProcessingAuth(false);
      });
  }, [instance]);

  /**
   * Auto logout on page load if already logged in
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthCode = urlParams.has('code') || urlParams.has('state');
    if (hasAuthCode) return;

    if (isAuthenticated) {
      localLogout();
    }

    if (accounts.length > 0) {
      instance.logoutPopup().catch((err) => {
        console.error("MSAL logout failed:", err);
      });
    }
  }, []);

  /**
   * Detect WebView
   */
  const isWebView = () => {
    if (window.isNativeApp || localStorage.getItem('isNativeApp') === 'true') {
      return true;
    }
    if (window.ReactNativeWebView !== undefined) {
      return true;
    }
    const userAgent = navigator.userAgent || '';
    return userAgent.includes('ReactNative') || 
           (userAgent.includes('Mobile') && !userAgent.includes('Safari')) ||
           userAgent.includes('wv');
  };

  /**
   * Handle Microsoft login
   */
  const handleMicrosoftLogin = () => {
    const loginRequest = {
      scopes: [
        "openid",
        "profile", 
        "email",
        "api://aa825561-377d-4414-8acc-2905cd587e98/Roles.Read"
      ],
    };

    const userAgent = navigator.userAgent || '';
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const urlParams = new URLSearchParams(window.location.search);
    const hasMobileParam = urlParams.has('mobile');
    
    if (isMobileDevice || hasMobileParam || isWebView()) {
      console.log('[Login] Mobile device detected, using loginRedirect');
      sessionStorage.setItem('mobileAuthPending', 'true');
      localStorage.setItem('mobileAuthPending', 'true');
      instance.loginRedirect(loginRequest);
      return;
    }

    instance
      .loginPopup(loginRequest)
      .then((response) => {
        const accessToken = response.accessToken;
        if (accessToken) {
          login(accessToken);
          toast.success("Login effettuato con successo!", {
            position: "bottom-right",
            hideProgressBar: true,
          });
          navigate("/");
        } else {
          toast.error("No access token received from Microsoft", {
            position: "bottom-right",
            hideProgressBar: true,
          });
        }
      })
      .catch((error) => {
        console.error("MSAL loginPopup error", error);
        toast.error("Could not sign in with Microsoft.", {
          position: "bottom-right",
          hideProgressBar: true,
        });
      });
  };

  // Loading state
  if (isProcessingAuth) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-[#97002D]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          <p className="text-white">Autenticazione in corso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Left side: Senato logo and Microsoft login */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md flex flex-col items-center px-6 py-12">
          
          {/* Senato Logo */}
          <div className="mb-12">
            <svg 
              width="140" 
              height="140" 
              viewBox="0 0 800 800" 
              fill="#97002D"
              className="drop-shadow-lg"
            >
              <path d="m498.889,798.925c-25.093-1.948-43.801-4.778-66.173-10.01-10.753-2.515-34.215-7.513-52.136-11.107-18.115-3.633-57.085-12.719-87.755-20.46-81.182-20.491-99.439-23.929-131.979-24.854-17.328-.493-37.401.671-40.103,2.325-.363.222.209,2.206,1.271,4.409,4.272,8.861,3.416,17.157-2.463,23.867-8.946,10.211-25.557,9.544-31.126-1.249-2.561-4.964-3.343-15.913-1.585-22.205,3.731-13.356,17.78-22.161,41.637-26.097,8.431-1.391,15.311-1.555,44.561-1.066,19.025.318,35.793.863,37.263,1.21,2.599.614,2.695.47,3.509-5.247,1.305-9.17.962-44.081-.517-52.602-2.952-17.008-10.695-42.424-14.522-47.67-1.262-1.729-2.178-1.381-15.292,5.813-32.375,17.761-73.226,27.947-106.191,26.48-27.25-1.213-46.442-9.966-60.578-27.627-19.626-24.522-22.287-62.552-6.257-89.436,10.563-17.716,25.036-29.417,43.775-35.391,10.616-3.385,32.073-3.894,48.126-1.142,30.931,5.303,60.75,16.567,114.03,43.074l40.838,20.317,28.343-29.654c15.589-16.31,28.446-29.97,28.573-30.356.127-.386-6.811-4.319-15.416-8.74-29.439-15.125-61.787-35.809-85.076-54.401-15.093-12.049-39.532-36.781-49.272-49.862-24.881-33.416-35.583-65.176-34.109-101.218,1.435-35.066,14.01-66.818,40.521-102.313,10.249-13.722,31.739-36.164,30.959-32.33-.281,1.382-1.028,8.164-1.66,15.072-3.715,40.615,8.743,81.596,35.942,118.23,8.471,11.409,32.798,35.892,46.217,46.514,29.434,23.297,65.345,43.537,105.047,59.205l5.203,2.053,4.582-6.434c5.452-7.657,6.316-9.565,4.331-9.565-5.833,0-65.854-34.49-91.508-52.583-42.986-30.317-72.783-64.436-85.267-97.634-11.527-30.653-6.794-85.118,10.565-121.566,10.156-21.325,31.363-45.549,51.642-58.986,50.528-33.483,122.182-44.1,195.01-28.895,31.154,6.504,64.016,19.537,85.743,34.003,15.355,10.224,54.125,43.918,58.722,51.033,1.396,2.16,1.584,2.058,12.446-6.741,18.637-15.098,38.174-25.769,55.146-30.119,29.907-7.665,66.831,5.96,88.265,32.571,12.043,14.952,17.49,30.395,17.503,49.625,0,5.694-.7,13.606-1.563,17.584-2.146,9.883-10.954,27.442-19.252,38.378-31.975,42.143-73.893,39.006-117.75-8.811-20.058-21.87-28.925-30.167-36.455-34.113-3.898-2.043-8.861-3.993-11.029-4.334l-3.942-.62-46.622,54.534c-25.642,29.994-47.4,55.519-48.351,56.722l-1.728,2.187,12.256,4.238c38.037,13.154,84.021,33.937,113.521,51.309,47.901,28.207,91.357,63.347,110.937,89.708,14.682,19.766,32.831,62.212,36.483,85.326,2.499,15.815,3.017,43.954,1.079,58.677-5.786,43.958-30.025,104.683-58.508,146.575-41.974,61.734-96.55,96.957-162.655,104.976-11.45,1.389-45.675,1.096-67.202-.575Z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TABULAS</h1>
          <p className="text-gray-500 mb-10 text-center">
            Portale Senato della Repubblica
          </p>

          {/* Microsoft Login Button */}
          <button
            onClick={handleMicrosoftLogin}
            className="w-full flex justify-center items-center gap-3 h-14 bg-[#97002D] hover:bg-[#7a0024] text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {/* Microsoft Icon */}
            <svg viewBox="0 0 21 21" className="w-5 h-5" fill="currentColor">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            <span>Accedi con Microsoft</span>
          </button>

          {/* Footer text */}
          <p className="mt-8 text-xs text-gray-400 text-center">
            Accesso riservato al personale autorizzato
          </p>
        </div>
      </div>

      {/* Right side: Animated background */}
      <div className="w-1/2 hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#97002D] via-[#B83D62] to-[#97002D]">
        {/* Animated floating circles */}
        <div className="absolute inset-0">
          {/* Circle 1 */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-float-slow"></div>
          {/* Circle 2 */}
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-float-medium"></div>
          {/* Circle 3 */}
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-white/5 rounded-full animate-float-fast"></div>
          {/* Circle 4 */}
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/10 rounded-full animate-float-medium delay-1000"></div>
          {/* Circle 5 */}
          <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-white/5 rounded-full animate-float-slow delay-500"></div>
        </div>
        
        {/* Center Senato Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg 
            width="400" 
            height="400" 
            viewBox="0 0 800 800" 
            fill="white"
          >
            <path d="m498.889,798.925c-25.093-1.948-43.801-4.778-66.173-10.01-10.753-2.515-34.215-7.513-52.136-11.107-18.115-3.633-57.085-12.719-87.755-20.46-81.182-20.491-99.439-23.929-131.979-24.854-17.328-.493-37.401.671-40.103,2.325-.363.222.209,2.206,1.271,4.409,4.272,8.861,3.416,17.157-2.463,23.867-8.946,10.211-25.557,9.544-31.126-1.249-2.561-4.964-3.343-15.913-1.585-22.205,3.731-13.356,17.78-22.161,41.637-26.097,8.431-1.391,15.311-1.555,44.561-1.066,19.025.318,35.793.863,37.263,1.21,2.599.614,2.695.47,3.509-5.247,1.305-9.17.962-44.081-.517-52.602-2.952-17.008-10.695-42.424-14.522-47.67-1.262-1.729-2.178-1.381-15.292,5.813-32.375,17.761-73.226,27.947-106.191,26.48-27.25-1.213-46.442-9.966-60.578-27.627-19.626-24.522-22.287-62.552-6.257-89.436,10.563-17.716,25.036-29.417,43.775-35.391,10.616-3.385,32.073-3.894,48.126-1.142,30.931,5.303,60.75,16.567,114.03,43.074l40.838,20.317,28.343-29.654c15.589-16.31,28.446-29.97,28.573-30.356.127-.386-6.811-4.319-15.416-8.74-29.439-15.125-61.787-35.809-85.076-54.401-15.093-12.049-39.532-36.781-49.272-49.862-24.881-33.416-35.583-65.176-34.109-101.218,1.435-35.066,14.01-66.818,40.521-102.313,10.249-13.722,31.739-36.164,30.959-32.33-.281,1.382-1.028,8.164-1.66,15.072-3.715,40.615,8.743,81.596,35.942,118.23,8.471,11.409,32.798,35.892,46.217,46.514,29.434,23.297,65.345,43.537,105.047,59.205l5.203,2.053,4.582-6.434c5.452-7.657,6.316-9.565,4.331-9.565-5.833,0-65.854-34.49-91.508-52.583-42.986-30.317-72.783-64.436-85.267-97.634-11.527-30.653-6.794-85.118,10.565-121.566,10.156-21.325,31.363-45.549,51.642-58.986,50.528-33.483,122.182-44.1,195.01-28.895,31.154,6.504,64.016,19.537,85.743,34.003,15.355,10.224,54.125,43.918,58.722,51.033,1.396,2.16,1.584,2.058,12.446-6.741,18.637-15.098,38.174-25.769,55.146-30.119,29.907-7.665,66.831,5.96,88.265,32.571,12.043,14.952,17.49,30.395,17.503,49.625,0,5.694-.7,13.606-1.563,17.584-2.146,9.883-10.954,27.442-19.252,38.378-31.975,42.143-73.893,39.006-117.75-8.811-20.058-21.87-28.925-30.167-36.455-34.113-3.898-2.043-8.861-3.993-11.029-4.334l-3.942-.62-46.622,54.534c-25.642,29.994-47.4,55.519-48.351,56.722l-1.728,2.187,12.256,4.238c38.037,13.154,84.021,33.937,113.521,51.309,47.901,28.207,91.357,63.347,110.937,89.708,14.682,19.766,32.831,62.212,36.483,85.326,2.499,15.815,3.017,43.954,1.079,58.677-5.786,43.958-30.025,104.683-58.508,146.575-41.974,61.734-96.55,96.957-162.655,104.976-11.45,1.389-45.675,1.096-67.202-.575Z" />
          </svg>
        </div>

        {/* Animated pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border border-white/10 rounded-full animate-pulse-ring"></div>
          <div className="absolute w-80 h-80 border border-white/5 rounded-full animate-pulse-ring delay-500"></div>
          <div className="absolute w-96 h-96 border border-white/5 rounded-full animate-pulse-ring delay-1000"></div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

export default NewLoginPage;
