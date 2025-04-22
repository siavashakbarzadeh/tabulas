import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ArraowDownIcon from "../../icons/ArraowDown";

// Our menu data
const Menu = [
  {
    id: 1,
    title: "Assemblea",
    icon: <i className="fa-duotone text-xl fa-poll-people w-6 h-6" />,
    link: "/"
  },
  {
    id: 2,
    title: "Commissioni",
    icon: <i className="fa-duotone text-xl fa-users w-6 h-6" />,
    link: "/commissioni"
  },
  {
    id: 3,
    title: "Ultimi atti",
    icon: <i className="fa-duotone text-xl fa-clock-rotate-left w-6 h-6" />,
    link: "/ultimiatti"
  },
  {
    id: 4,
    title: "Ultimi dossier",
    icon: <i className="fa-duotone text-xl fa-file-circle-exclamation w-6 h-6"></i>,
    subMenu: [
      {
        id: 1,
        title: "Prima pagina",
        icon: "",
        link: "/ultimdossier"
      },
      {
        id: 2,
        title: "Seconda pagina",
        icon: "",
        link: "/ultimdossier1"
      },
    ],
  },
  {
    id: 5,
    title: "Ebook",
    icon: <i className="fa-duotone text-xl fa-book w-6 h-6" />,
    link: "/ebook"
  },
  {
    id: 6,
    title: "Guide e manuali",
    icon: <i className="fa-duotone text-xl fa-book-open-cover w-6 h-6" />,
    link: "/guidemanuali"
  },
  {
    id: 7,
    title: "Diretta Senato",
    icon: <i className="fa-duotone text-xl fa-play w-6 h-6" />,
    link: "/diretta"
  },
  {
    id: 8,
    title: "Le Firme",
    icon: <i className="fa-duotone text-xl fa-pen-to-square w-6 h-6"></i>,
    subMenu: [
      {
        id: 1,
        title: "Nuova",
        icon: <i className="fa-duotone text-sm fa-file-pen w-6 h-6"></i>,
        link: "/form"
      },
      {
        id: 2,
        title: "Inbox",
        icon: <i className="fa-duotone text-sm fa-inbox w-6 h-6"></i>,
        link: "/inbox"
      },
      {
        id: 3,
        title: "Outbox",
        icon: <i className="fa-duotone text-sm fa-paper-plane w-6 h-6"></i>,
        link: "/outbox"
      },
    ],
  },
  {
    id: 9,
    title: "Notifiche",
    icon: <i className="fa-duotone text-xl fa-bell w-6 h-6"></i>,
    subMenu: [
      {
        id: 1,
        title: "Nuova",
        icon: <i className="fa-duotone text-sm fa-bell w-6 h-6"></i>,
        link: "/notification"
      },
      {
        id: 2,
        title: "Messaggi inviati",
        icon: <i className="fa-duotone text-sm fa-envelope-open-text w-6 h-6"></i>,
        link: "/pushed"
      },
    ],
  },
  {
    id: 10,
    title: "Servizi",
    icon: <i className="fa-duotone text-xl fa-screwdriver-wrench w-6 h-6" />,
    link: "/services"
  },
  {
    id: 11,
    title: "Commissioni permanenti",
    icon: <i className="fa-duotone text-xl fa-user-group w-6 h-6" />,
    link: "/commissioni-permanenti"
  },
  {
    id: 12,
    title: "Giunte e altre comissioni",
    icon: <i className="fa-duotone text-xl fa-comments w-6 h-6" />,
    link: "/giunte-e-altre-comissioni"
  },
  {
    id: 13,
    title: "Bicamerali e delegazioni",
    icon: <i className="fa-duotone text-xl fa-user-group w-6 h-6" />,
    link: "/bicamerali-e-delegazioni"
  },
  {
    id: 14,
    title: "INFORMAZIONE",
    icon: <i className="fa-duotone text-xl fa-square-exclamation w-6 h-6" />,
    link: "/"
  },
];

function Menu2() {
  const location = useLocation();

  // activeMain is the currently expanded main menu item
  // activeSub is the currently active sub menu item
  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  // On mount or route change, figure out which item or subItem is the current route
  // and open that submenu (if any)
  useEffect(() => {
    // For each main menu item:
    // 1) If item.link === location.pathname => that item is active.
    // 2) If item.subMenu exists, see if any subItem.link === location.pathname => that sub is active
    //    Also expand that main item.

    let foundMain = null;
    let foundSub = null;

    for (const item of Menu) {
      // If there's a direct link match for the main item
      if (item.link && item.link === location.pathname) {
        foundMain = item.id;
        break;
      }
      // If it has a subMenu
      if (item.subMenu) {
        for (const subItem of item.subMenu) {
          if (subItem.link === location.pathname) {
            foundMain = item.id;
            foundSub = subItem.id;
            break;
          }
        }
      }
      if (foundMain) break;
    }

    setActiveMain(foundMain);
    setActiveSub(foundSub);
  }, [location]);

  const toggleMenuHandler = (id) => () => {
    // Toggle the main menu item open or closed, but only if it has a subMenu
    setActiveMain((prev) => (prev === id ? null : id));
    setActiveSub(null);
  };

  return (
    <ul className="w-full mt-4">
      {Menu.map((item) => {
        const isMainOpen = activeMain === item.id;
        const hasSubmenu = !!item.subMenu;

        return (
          <li key={item.id} className="w-full">
            {hasSubmenu ? (
              <div
                onClick={toggleMenuHandler(item.id)}
                className={`w-full h-10 flex items-center space-x-2 px-2 text-sm cursor-pointer ${isMainOpen
                  ? "bg-white text-red-700 rounded-md hover:text-red-600"
                  : "text-white hover:text-white/80"
                  }`}
              >
                {item.icon}
                <span>{item.title}</span>
                <ArraowDownIcon
                  className={`w-2.5 transition-transform duration-150 ${isMainOpen ? "" : "-rotate-90"
                    }`}
                />
              </div>
            ) : (
              <Link
                to={item.link}
                onClick={() => {
                  setActiveMain(item.id);
                  setActiveSub(null);
                }}
                className={`w-full h-10 flex items-center space-x-2 px-2 text-sm cursor-pointer ${activeMain === item.id
                  ? "bg-white text-red-700 rounded-md hover:text-red-600"
                  : "text-white hover:text-white/80"
                  }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}

            {/* Submenu */}
            {hasSubmenu && (
              <ul
                className={`w-full ${isMainOpen ? "" : "hidden"
                  } space-y-1 rounded-xl overflow-hidden`}
              >
                {item.subMenu.map((subItem) => {
                  const isSubActive = activeSub === subItem.id;
                  return (
                    <li key={subItem.id} className="w-full">
                      <Link
                        to={subItem.link}
                        onClick={() => {
                          setActiveMain(item.id);
                          setActiveSub(subItem.id);
                        }}
                        className={`w-full h-10 flex items-center px-6 space-x-2 text-white bg-white/5 cursor-pointer ${isSubActive ? "bg-red-700" : ""
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
