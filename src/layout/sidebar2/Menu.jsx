import { Link } from "react-router-dom";
import { useState } from "react";
import User from "../../icons/User";
import NotificationIcon from "../../icons/NotificationIcon";
import EbookIcon from "../../icons/Ebook";
import LatestDossiersIcon from "../../icons/LatestDossiers";
import ServicesIcon from "../../icons/ServicesIcon";
import EmailIcon from "../../icons/EmailIcon";
import FormIcon from "../../icons/FormIcon";
import LatestActsIcon from "../../icons/LatestActs";
import GuideManualsIcon from "../../icons/GuideManuals";
import UsersIcon from "../../icons/Users";
import ChatIcon from "../../icons/Chat";
import Play2Icon from "../../icons/Play2";
import NoticeIcon from "../../icons/Notice";
import PaperIcon from "../../icons/Paper";
import ArraowDownIcon from "../../icons/ArraowDown";

const Menu = [
  {
    id: 1,
    title: "Assemblea",
    icon: <PaperIcon className="w-6 h-6" />,
    subMenu: [
      { id: 1, title: "Services", icon: <ServicesIcon className="w-6 h-6" />, link: "/services" },
      { id: 2, title: "Guidemanuali", icon: <GuideManualsIcon className="w-6 h-6" />, link: "/guidemanuali" },
      { id: 3, title: "Ebook", icon: <EbookIcon className="w-6 h-6" />, link: "/ebook" },
      { id: 4, title: "Commissioni", icon: <UsersIcon className="w-6 h-6" />, link: "/commissioni" },
      { id: 5, title: "Ultimi atti", icon: <LatestActsIcon className="w-6 h-6" />, link: "/ultimiatti" },
      { id: 6, title: "Ultimi dossier", icon: <LatestDossiersIcon className="w-6 h-6" />, link: "/ultimdossier" },
    ],
  },
  { id: 2, title: "Commissioni permanenti", icon: <User className="w-6 h-6" />, link: "/commissioni-permanenti" },
  { id: 3, title: "Giunte e altre comissioni", icon: <ChatIcon className="w-6 h-6" />, link: "/giunte-e-altre-comissioni" },
  { id: 4, title: "Bicamerali e delegazioni", icon: <UsersIcon className="w-6 h-6" />, link: "/giunte-e-altre-comissioni" },

  { id: 5, title: "Diretta Senato", icon: <Play2Icon className="w-6 h-6" />, link: "/" },
  { id: 6, title: "INFORMAZIONE", icon: <NoticeIcon className="w-6 h-6" />, link: "/" },
  {
    id: 7, title: "Le Firme", icon: <PaperIcon className="w-6 h-6" />,
    subMenu: [
      { id: 1, title: "Nuova", icon: '', link: "/form" },
      { id: 2, title: "Inbox", icon: '', link: "/inbox" },
      { id: 3, title: "Outbox", icon: '', link: "/outbox" },
    ]
  },
  { id: 6, title: "Push notification", icon: <NotificationIcon className="w-6 h-6" />, link: "/notification" },

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
              className={`w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer ${activeMain === item.id ? "bg-gray-700" : ""
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
              className={`w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer ${activeMain === item.id ? "bg-gray-700" : ""
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
                    className={`w-full h-10 flex items-center px-2 space-x-2 text-white bg-white/5 cursor-pointer ${activeSub === subItem.id ? "bg-red-700" : ""
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
