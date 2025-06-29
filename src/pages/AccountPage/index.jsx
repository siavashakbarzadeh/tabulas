// src/pages/AccountPage.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";

function AccountPage() {
  const { user } = useAuth();           // ← same hook you use elsewhere

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Account</h1>

      {user ? (
        <>
          <p className="mb-2">
            Signed in as <strong>{user.email}</strong>
          </p>
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-primary-900 text-3xl font-semibold">
            {user.email.substring(0, 1).toUpperCase()}
          </div>
        </>
      ) : (
        <p>No user information found.</p>
      )}
    </div>
  );
}

export default AccountPage;
