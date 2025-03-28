import { Link } from "react-router-dom";
import { useState } from "react";
import ArraowDownIcon from "../../icons/ArraowDown";

const Menu = [
  {
    id: 1,
    title: "Assemblea",
    icon: <i className="fa-duotone text-xl  fa-poll-people w-6 h-6" />,
    link: "/"
  },
  {
    id: 2,
    title: "Servizi",
    icon: <i className="fa-duotone text-xl  fa-screwdriver-wrench w-6 h-6" />,
    link: "/services"
  },
  {
    id: 3,
    title: "Guide e manuali",
    icon: <i className="fa-duotone text-xl  fa-book-open-cover w-6 h-6" />,
    link: "/guidemanuali"
  },
  {
    id: 4,
    title: "Ebook",
    icon: <i className="fa-duotone text-xl  fa-book w-6 h-6" />,
    link: "/ebook"
  },
  {
    id: 5,
    title: "Commissioni",
    icon: <i className="fa-duotone text-xl  fa-users w-6 h-6" />,
    link: "/commissioni"
  },
  {
    id: 6,
    title: "Ultimi atti",
    icon: <i className="fa-duotone text-xl  fa-clock-rotate-left w-6 h-6" />,
    link: "/ultimiatti"
  },
  {
    id: 7,
    title: "Ultimi dossier",
    icon: <i className="fa-duotone text-xl  fa-file-circle-exclamation w-6 h-6" />,
    link: "/ultimdossier"
  },

  // Other top-level items
  {
    id: 8,
    title: "Commissioni permanenti",
    icon: <i className="fa-duotone text-xl  fa-user-group w-6 h-6" />,
    link: "/commissioni-permanenti"
  },
  {
    id: 9,
    title: "Giunte e altre comissioni",
    icon: <i className="fa-duotone text-xl  fa-comments w-6 h-6" />,
    link: "/giunte-e-altre-comissioni"
  },
  {
    id: 10,
    title: "Bicamerali e delegazioni",
    icon: <i className="fa-duotone text-xl  fa-user-group w-6 h-6" />,
    link: "/giunte-e-altre-comissioni"
  },
  {
    id: 11,
    title: "Diretta Senato",
    icon: <i className="fa-duotone text-xl  fa-play w-6 h-6" />,
    link: "/diretta"
  },
  {
    id: 12,
    title: "INFORMAZIONE",
    icon: <i className="fa-duotone text-xl  fa-newspaper w-6 h-6" />,
    link: "/"
  },

  // Nested submenus remain intact
  {
    id: 13,
    title: "Le Firme",
    icon: <i className="fa-duotone text-xl  fa-pen-to-square w-6 h-6"></i>,
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
    id: 14,
    title: "Push notification",
    icon: <i className="fa-duotone text-xl  fa-bell w-6 h-6"></i>,
    subMenu: [
      {
        id: 1,
        title: "Nuova",
        icon: <i className="fa-duotone text-sm fa-bell w-6 h-6"></i>,
        link: "/notification"
      },
      {
        id: 2,
        title: "Messages",
        icon: <i className="fa-duotone text-sm fa-envelope-open-text w-6 h-6"></i>,
        link: "/pushed"
      },
    ],
  },
];

function Menu2() {
  // activeMain tracks the currently open (or active) main menu item
  // activeSub tracks the active submenu item's id
  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  const toggleMenuHandler = (id) => () => {
    // Toggle the main menu item open or closed.
    setActiveMain((prev) => (prev === id ? null : id));
    // Reset active submenu when toggling a main menu item.
    setActiveSub(null);
  };

  return (
    <ul className="w-full mt-4">
      {Menu.map((item) => (
        <li key={item.id} className="w-full">
          {item.subMenu ? (
            <div
              onClick={toggleMenuHandler(item.id)}
              className={`w-full h-10 flex items-center space-x-2 px-2 text-md cursor-pointer ${activeMain === item.id ? "bg-white text-red-700 rounded-md hover:text-red-600" : "text-white hover:text-white/80"
                }`}
            >
              {item.icon}
              <span>{item.title}</span>
              <ArraowDownIcon
                className={`w-2.5 transition-transform duration-150 ${activeMain === item.id ? "" : "-rotate-90"
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
              className={`w-full h-10 flex items-center space-x-2 px-2 text-sm cursor-pointer ${activeMain === item.id ? "bg-white text-red-700 rounded-md hover:text-red-600 " : "text-white hover:text-white/80"
                }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          )}
          {item.subMenu && (
            <ul
              className={`w-full ${activeMain === item.id ? "" : "hidden"} space-y-1 rounded-xl overflow-hidden`}
            >
              {item.subMenu.map((subItem) => (
                <li key={subItem.id} className="w-full">
                  <Link
                    to={subItem.link}
                    onClick={() => {
                      setActiveMain(item.id);
                      setActiveSub(subItem.id);
                    }}
                    className={`w-full h-10 flex items-center px-6 space-x-2 text-white bg-white/5 cursor-pointer ${activeSub === subItem.id ? "bg-red-700" : ""
                      }`}
                  >
                    {subItem.icon && <span>{subItem.icon}</span>}
                    <span>{subItem.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default Menu2;
