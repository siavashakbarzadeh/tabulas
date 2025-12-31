import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Mobile Auth Callback Page
 * Shows after Microsoft OAuth login redirects here
 * Reads access_token from URL hash and displays "Torna all'App" button
 */
function MobileAuthCallback() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const extractToken = () => {
      console.log('[MobileAuthCallback] Extracting token from URL');
      console.log('[MobileAuthCallback] Hash:', window.location.hash);
      console.log('[MobileAuthCallback] Search:', window.location.search);
      
      // Try to get token from various sources
      
      // 1. Check URL query param (from our redirect)
      const searchParams = new URLSearchParams(window.location.search);
      let accessToken = searchParams.get('token');
      
      // 2. Check URL hash (OAuth implicit flow response)
      if (!accessToken && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        accessToken = hashParams.get('access_token');
        
        // Also check for error in hash
        const hashError = hashParams.get('error');
        if (hashError) {
          const errorDesc = hashParams.get('error_description') || 'Login fallito';
          console.error('[MobileAuthCallback] OAuth error:', hashError, errorDesc);
          setError(decodeURIComponent(errorDesc));
          setIsLoading(false);
          return;
        }
      }
      
      // 3. Check localStorage (from MSAL redirect handling or normal login)
      if (!accessToken) {
        accessToken = localStorage.getItem('mobileAuthToken');
      }
      
      // 4. Check auth-token (from normal web login)
      if (!accessToken) {
        accessToken = localStorage.getItem('auth-token');
      }
      
      if (accessToken) {
        console.log('[MobileAuthCallback] Found token');
        setToken(accessToken);
        localStorage.setItem('mobileAuthToken', accessToken);
      } else {
        console.log('[MobileAuthCallback] No token found');
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

    // Clear the temporary storage
    localStorage.removeItem('mobileAuthToken');
    localStorage.removeItem('mobileAuthPending');

    // Redirect to native app via deep link
    const deepLinkUrl = `tabulas://auth?token=${encodeURIComponent(token)}`;
    
    console.log('[MobileAuthCallback] Redirecting to app');
    
    // Try to open the app
    window.location.href = deepLinkUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-900 border-t-transparent"></div>
          <p className="text-zinc-600">Elaborazione login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Errore</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-primary-900 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
          >
            Torna al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="text-center">
        {/* Success Icon - SVG checkmark */}
        <div className="text-green-500 text-6xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Login Effettuato!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Scegli come continuare:
        </p>

        {/* Return to App Button */}
        <button
          onClick={handleReturnToApp}
          className="w-full max-w-xs px-8 py-4 bg-primary-900 text-white text-lg rounded-xl font-semibold hover:bg-primary-800 transition-colors shadow-lg mb-4 flex items-center justify-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Torna all'App
        </button>

        {/* Continue in Browser Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-xs px-8 py-4 bg-gray-100 text-gray-700 text-lg rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Continua nel browser
        </button>
      </div>
    </div>
  );
}

export default MobileAuthCallback;
