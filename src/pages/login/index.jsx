// src/pages/AccountPage.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  const { user, logout: localLogout } = useAuth();
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  /* ───── Early-return if no user ───── */
  if (!user) {
    return (
      <div className="p-6 text-white mt-6">
        <h1 className="text-2xl font-semibold mb-4">Account</h1>
        <p>No user information found.</p>
      </div>
    );
  }

  const initial = user.email.substring(0, 1).toUpperCase();

  /* ───── Combined logout handler ───── */
  const handleLogout = async () => {
    localLogout();                         // clear your local auth state

    if (accounts.length) {
      try {
        await instance.logoutPopup();      // sign out of Microsoft
      } catch (err) {
        console.error("MSAL logout failed:", err);
      }
    }

    navigate("/login");                    // back to login screen
  };

  return (
    <div className="p-6 text-white space-y-8 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Account</h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-1 rounded-md bg-white text-primary-900 font-medium hover:bg-white/90"
        >
          Back
        </button>
      </div>

      {/* User block */}
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-primary-900 text-3xl font-semibold">
          {initial}
        </div>
        <p className="text-lg">
          Signed in as <strong>{user.email}</strong>
        </p>
      </div>

      {/* Full-width logout button */}
      <button
        onClick={handleLogout}
        className="w-full h-12 bg-red-600 rounded-lg font-semibold text-white hover:bg-red-700 transition-colors"
      >
        LOG OUT
      </button>
    </div>
  );
}

export default AccountPage;
