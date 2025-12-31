import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Mobile Auth Callback Page
 * Shows after successful MSAL login from native app
 * Displays "Torna all'App" button to redirect back to native app with token
 */
function MobileAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get token from URL or localStorage
    const urlToken = searchParams.get('token');
    const storedToken = localStorage.getItem('mobileAuthToken');
    
    if (urlToken) {
      setToken(urlToken);
      // Store for button click
      localStorage.setItem('mobileAuthToken', urlToken);
    } else if (storedToken) {
      setToken(storedToken);
    } else {
      setError('Nessun token trovato. Riprova il login.');
    }
  }, [searchParams]);

  const handleReturnToApp = () => {
    if (!token) {
      setError('Token non disponibile');
      return;
    }

    // Clear the temporary storage
    localStorage.removeItem('mobileAuthToken');
    localStorage.removeItem('mobileAuthPending');

    // Redirect to native app via deep link
    // Bundle: org.reactjs.native.example.TabulasNative
    const deepLinkUrl = `tabulas://auth?token=${encodeURIComponent(token)}`;
    
    console.log('[MobileAuthCallback] Redirecting to app:', deepLinkUrl);
    
    // Try to open the app
    window.location.href = deepLinkUrl;
  };

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
