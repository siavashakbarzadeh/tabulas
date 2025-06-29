// src/pages/AccountPage.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="pt-6 text-white mt-6">
        <h1 className="text-2xl font-semibold mb-4">Account</h1>
        <p>No user information found.</p>
      </div>
    );
  }

  const initial = user.email.substring(0, 1).toUpperCase();

  return (
    <div className="p-6 text-white space-y-6 mt-6">
      {/* ───────── Header row ───────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Account</h1>

        <button
          onClick={() => navigate(-1)}          // go back one step
          className="px-4 py-1 rounded-md bg-white text-primary-900 font-medium hover:bg-white/90"
        >
          Back
        </button>
      </div>

      {/* ───────── User block ───────── */}
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-primary-900 text-3xl font-semibold">
          {initial}
        </div>

        {/* E-mail */}
        <p className="text-lg">
          Signed in as <strong>{user.email}</strong>
        </p>
      </div>
    </div>
  );
}

export default AccountPage;
