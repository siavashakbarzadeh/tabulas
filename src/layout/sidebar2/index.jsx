// Sidebar2.jsx
import { Link } from "react-router-dom";
import Menu2 from "./Menu";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar2({ isSidebarActive = false, setIsSidebarActive }) {
  const { user } = useAuth();

  /* helper: hide the whole sidebar */
  const closeSidebar = () => setIsSidebarActive(false);

  return (
    <aside
      className={`
        w-auto lg:w-68 pt-4 pb-16 lg:pb-4 pl-4 pr-2 fixed 
        left-0 top-auto lg:top-0 right-0 lg:right-auto bottom-0 
        z-10 bg-primary-900 transition-transform lg:transition-none duration-300 
        ${isSidebarActive ? "translate-y-0" : "translate-y-full"} lg:translate-y-0
      `}
    >
      {/* Mobile “×” button */}
      {isSidebarActive && (
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 z-30 lg:hidden text-white text-3xl font-bold"
          aria-label="Close menu"
        >
          &times;
        </button>
      )}

      {/* User block */}
      <Link className="flex gap-2 select-none">
        <div className="w-11 h-11 flex justify-center items-center flex-shrink-0 rounded-xl bg-white">
          {user?.email && (
            <span className="text-2xl text-zinc-900">
              {user.email.substring(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col justify-center">
          <div className="leading-6 text-white">-</div>
          <span className="text-xs leading-5 text-white/50">{user?.email}</span>
        </div>
      </Link>

      {/* Menu */}
      <Menu2 onNavigate={closeSidebar} />   
    </aside>
  );
}

export default Sidebar2;
