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
        {/* Success Icon */}
        <div className="text-green-500 text-6xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Login Effettuato!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Clicca il pulsante per tornare all'applicazione
        </p>

        {/* Return to App Button */}
        <button
          onClick={handleReturnToApp}
          className="px-8 py-4 bg-primary-900 text-white text-lg rounded-xl font-semibold hover:bg-primary-800 transition-colors shadow-lg"
        >
          <i className="fas fa-mobile-alt mr-2"></i>
          Torna all'App
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Se il pulsante non funziona, chiudi questa finestra manualmente
        </p>
      </div>
    </div>
  );
}

export default MobileAuthCallback;
