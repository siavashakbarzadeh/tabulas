// Sidebar2.jsx
import { useNavigate } from "react-router-dom";
import Menu2 from "./Menu";
import { useAuth } from "../../contexts/AuthContext";
import { useMsal } from "@azure/msal-react";

function Sidebar2({ isSidebarActive = false, setIsSidebarActive }) {
  const { user, logout } = useAuth();
  const { instance } = useMsal();
  const navigate = useNavigate();

  /* helper: hide the whole sidebar */
  const closeSidebar = () => setIsSidebarActive(false);

  const handleLogout = async () => {
    closeSidebar();
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

  return (
    <aside
      className={`
        w-auto lg:w-68 pt-4 pb-16 lg:pb-4 pl-4 pr-2 fixed 
        left-0 top-auto lg:top-0 right-0 lg:right-auto bottom-0 
        z-10 bg-primary-900 transition-transform lg:transition-none duration-300 
        ${isSidebarActive ? "translate-y-0" : "translate-y-full"} lg:translate-y-0
      `}
    >
      {/* User block */}
      <div className="flex gap-2 select-none items-center">
        <div className="w-11 h-11 flex justify-center items-center flex-shrink-0 rounded-xl bg-white">
          <span className="text-2xl text-zinc-900">
            {getInitials(user?.name, user?.email)}
          </span>
        </div>
        <div className="w-full flex flex-col justify-center flex-1">
          <div className="leading-6 text-white text-sm font-medium truncate">
            {user?.name || 'Utente'}
          </div>
          <span className="text-xs leading-5 text-white/50 truncate">{user?.email}</span>
        </div>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="Esci"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Menu */}
      <Menu2 onNavigate={closeSidebar} />   
    </aside>
  );
}

export default Sidebar2;
