// Menu.jsx   (rename the file if you prefer)

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ArraowDownIcon from "../../icons/ArraowDown";

/* ───────────── Your menu data (unchanged) ───────────── */
const Menu = [
  {
    id: 1,
    title: "Assemblea",
    icon: <i className="fa-duotone text-xl fa-poll-people w-6 h-6" />,
    link: "/",
  },
  {
    id: 2,
    title: "Commissioni",
    icon: <i className="fa-duotone text-xl fa-users w-6 h-6" />,
    link: "/commissioni",
  },
  {
    id: 3,
    title: "Ultimi atti",
    icon: <i className="fa-duotone text-xl fa-clock-rotate-left w-6 h-6" />,
    link: "/ultimiatti",
  },
  {
    id: 4,
    title: "Ultimi dossier",
    icon: <i className="fa-duotone text-xl fa-file-circle-exclamation w-6 h-6" />,
    link: "/ultimdossier",
  },
  {
    id: 5, title: "Ebook", icon: <i className="fa-duotone text-xl fa-book w-6 h-6" />, link: "/ebook",
  },
  {
    id: 6, title: "Guide e manuali", icon: <i className="fa-duotone text-xl fa-book-open-cover w-6 h-6" />, link: "/guidemanuali",
  },
  {
    id: 7, title: "Diretta Senato", icon: <i className="fa-duotone text-xl fa-play w-6 h-6" />, link: "/diretta",
  },
  {
    id: 8,
    title: "Le Firme",
    icon: <i className="fa-duotone text-xl fa-pen-to-square w-6 h-6" />,
    subMenu: [
      { id: 1, title: "Nuova", icon: <i className="fa-duotone text-sm fa-file-pen w-6 h-6" />, link: "/form" },
      { id: 2, title: "Inbox", icon: <i className="fa-duotone text-sm fa-inbox w-6 h-6" />, link: "/inbox" },
      { id: 3, title: "Outbox", icon: <i className="fa-duotone text-sm fa-paper-plane w-6 h-6" />, link: "/outbox" },
    ],
  },
  {
    id: 9,
    title: "Notifiche",
    icon: <i className="fa-duotone text-xl fa-bell w-6 h-6" />,
    subMenu: [
      { id: 1, title: "Nuova", icon: <i className="fa-duotone text-sm fa-bell w-6 h-6" />, link: "/notification" },
      { id: 2, title: "Messaggi inviati", icon: <i className="fa-duotone text-sm fa-envelope-open-text w-6 h-6" />, link: "/pushed" },
    ],
  },
  {
    id: 10, title: "Servizi", icon: <i className="fa-duotone text-xl fa-screwdriver-wrench w-6 h-6" />, link: "/services",
  },
  {
    id: 11, title: "INFORMAZIONE", icon: <i className="fa-duotone text-xl fa-square-exclamation w-6 h-6" />, link: "/",
  },
];
function Menu2({ onNavigate = () => {} }) {        
  const location = useLocation();

  // which section is open?
  const [expandedMain, setExpandedMain] = useState(null);
  // which page is highlighted?
  const [activeMain, setActiveMain]   = useState(null);
  const [activeSub,  setActiveSub]    = useState(null);

  /* highlight the current route */
  useEffect(() => {
    let foundMain = null;
    let foundSub  = null;

    for (const item of Menu) {
      if (item.link === location.pathname) {
        foundMain = item.id;
        break;
      }
      if (item.subMenu) {
        for (const sub of item.subMenu) {
          if (sub.link === location.pathname) {
            foundMain = item.id;
            foundSub  = sub.id;
            break;
          }
        }
      }
      if (foundMain) break;
    }
    setActiveMain(foundMain);
    setActiveSub(foundSub);
  }, [location]);

  /* open / close a section */
  const toggleMenuHandler = (id) => () =>
    setExpandedMain((prev) => (prev === id ? null : id));

  /* called when the user clicks a real <Link>  */
  const handleNavigate = () => {
    setExpandedMain(null);   // fold the accordion itself
    onNavigate();            // ← tell the parent to close the whole sidebar
  };

  return (
    <ul className="w-full mt-4">
      {Menu.map((item) => {
        const hasSub  = Boolean(item.subMenu);
        const isOpen  = expandedMain === item.id;
        const active  = activeMain === item.id;

        return (
          <li key={item.id} className="w-full">
            {/* ─── Main row ─── */}
            {hasSub ? (
              <div
                onClick={toggleMenuHandler(item.id)}
                className={`w-full h-10 flex items-center space-x-2 px-2 text-sm cursor-pointer ${
                  isOpen || active
                    ? "bg-white text-red-700 rounded-md hover:text-red-600"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
                <ArraowDownIcon
                  className={`w-2.5 transition-transform duration-150 ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
              </div>
            ) : (
              <Link
                to={item.link}
                onClick={handleNavigate}
                className={`w-full h-10 flex items-center space-x-2 px-2 text-sm cursor-pointer ${
                  active
                    ? "bg-white text-red-700 rounded-md hover:text-red-600"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}

            {/* ─── Sub-items ─── */}
            {hasSub && (
              <ul
                className={`w-full ${isOpen ? "" : "hidden"} space-y-1 rounded-xl overflow-hidden`}
              >
                {item.subMenu.map((sub) => {
                  const subActive = activeSub === sub.id;
                  return (
                    <li key={sub.id} className="w-full">
                      <Link
                        to={sub.link}
                        onClick={handleNavigate}
                        className={`w-full h-10 flex items-center px-6 space-x-2 text-[11px] text-white bg-white/5 cursor-pointer ${
                          subActive ? "bg-red-700" : ""
                        }`}
                      >
                        {sub.icon && <span>{sub.icon}</span>}
                        <span>{sub.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default Menu2;
