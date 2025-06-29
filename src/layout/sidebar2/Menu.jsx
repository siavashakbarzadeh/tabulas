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
    subMenu: [
      { id: 1, title: "Tutte le commissioni", icon: <i className="fa-duotone text-xl fa-users w-6 h-6" />, link: "/commissioni" },
      { id: 2, title: "Commissioni permanenti", icon: <i className="fa-duotone text-xl fa-user-group w-6 h-6" />, link: "/commissioni-permanenti" },
      { id: 3, title: "Giunte e altre comissioni", icon: <i className="fa-duotone text-xl fa-comments w-6 h-6" />, link: "/giunte-e-altre-comissioni" },
      { id: 4, title: "Bicamerali e delegazioni", icon: <i className="fa-duotone text-xl fa-user-group w-6 h-6" />, link: "/bicamerali-e-delegazioni" },
    ],
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
    subMenu: [
      { id: 1, title: "Prima pagina", icon: "", link: "/ultimdossier" },
      { id: 2, title: "Seconda pagina", icon: "", link: "/ultimdossier1" },
    ],
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

/* ───────────── Component ───────────── */
function Menu2() {
  const location = useLocation();

  // Which section is expanded?
  const [expandedMain, setExpandedMain] = useState(null);

  // Which page is currently selected?
  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  /* —— On every route change, highlight the current page ——
     We DO NOT change `expandedMain` here, so the drawer
     stays folded unless the user explicitly opens it.       */
  useEffect(() => {
    let foundMain = null;
    let foundSub  = null;

    for (const item of Menu) {
      if (item.link && item.link === location.pathname) {
        foundMain = item.id;
        break;
      }
      if (item.subMenu) {
        for (const subItem of item.subMenu) {
          if (subItem.link === location.pathname) {
            foundMain = item.id;
            foundSub  = subItem.id;
            break;
          }
        }
      }
      if (foundMain) break;
    }

    setActiveMain(foundMain);
    setActiveSub(foundSub);
  }, [location]);

  /* —— Expand / collapse a main section —— */
  const toggleMenuHandler = (id) => () =>
    setExpandedMain((prev) => (prev === id ? null : id));

  /* —— Close the drawer after a navigation click —— */
  const closeMenu = () => setExpandedMain(null);

  return (
    <ul className="w-full mt-4">
      {Menu.map((item) => {
        const hasSubmenu  = Boolean(item.subMenu);
        const isOpen      = expandedMain === item.id;
        const isHighlighted = activeMain === item.id;

        return (
          <li key={item.id} className="w-full">
            {/* ─── Main row ─── */}
            {hasSubmenu ? (
              <div
                onClick={toggleMenuHandler(item.id)}
                className={`w-full h-10 flex items-center space-x-2 px-2 text-sm cursor-pointer ${
                  isOpen || isHighlighted
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
                onClick={closeMenu}
                className={`w-full h-10 flex items-center space-x-2 px-2 text-sm cursor-pointer ${
                  isHighlighted
                    ? "bg-white text-red-700 rounded-md hover:text-red-600"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}

            {/* ─── Sub-items ─── */}
            {hasSubmenu && (
              <ul
                className={`w-full ${isOpen ? "" : "hidden"} space-y-1 rounded-xl overflow-hidden`}
              >
                {item.subMenu.map((subItem) => {
                  const isSubActive = activeSub === subItem.id;
                  return (
                    <li key={subItem.id} className="w-full">
                      <Link
                        to={subItem.link}
                        onClick={closeMenu}
                        className={`w-full h-10 flex items-center px-6 space-x-2 text-[11px] text-white bg-white/5 cursor-pointer ${
                          isSubActive ? "bg-red-700" : ""
                        }`}
                      >
                        {subItem.icon && <span>{subItem.icon}</span>}
                        <span>{subItem.title}</span>
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
