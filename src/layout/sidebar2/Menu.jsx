import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import User from "../../icons/User";
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

const menuData = [
  {
    id: 1,
    title: "Assemblea",
    icon: <PaperIcon className="w-6 h-6" />,
    subMenu: [
      { id: 1, title: "Confirm", link: "/confirm" },
      { id: 2, title: "Email", icon: <EmailIcon className="w-6 h-6" />, link: "/email" },
      { id: 3, title: "Form", icon: <FormIcon className="w-6 h-6" />, link: "/form" },
      { id: 4, title: "Services", icon: <ServicesIcon className="w-6 h-6" />, link: "/services" },
      { id: 5, title: "Guidemanuali", icon: <GuideManualsIcon className="w-6 h-6" />, link: "/guidemanuali" },
      { id: 6, title: "Ebook", icon: <EbookIcon className="w-6 h-6" />, link: "/ebook" },
      {
        id: 7,
        title: "Commissioni",
        icon: <UsersIcon className="w-6 h-6" />,
        link: "/commissioni",
      },
      { id: 8, title: "Ultimiatti", icon: <LatestActsIcon className="w-6 h-6" />, link: "/ultimiatti" },
      { id: 9, title: "Ultimdossier", icon: <LatestDossiersIcon className="w-6 h-6" />, link: "/ultimdossier" },
    ],
  },
  { id: 2, title: "Commissioni permanenti", icon: <User className="w-6 h-6" />, link: "/commissioni-permanenti" },
  { id: 3, title: "Giunte e altre comissioni", icon: <ChatIcon className="w-6 h-6" />, link: "/giunte-e-altre-comissioni" },
  { id: 4, title: "Bicamerali e delegazioni", icon: <UsersIcon className="w-6 h-6" />, link: "/giunte-e-altre-comissioni" },
  { id: 5, title: "Diretta Senato", icon: <Play2Icon className="w-6 h-6" />, link: "/" },
  { id: 6, title: "INFORMAZIONE", icon: <NoticeIcon className="w-6 h-6" />, link: "/" },
];

function Menu() {
  const location = useLocation();
  const [openParent, setOpenParent] = useState(null);

  useEffect(() => {
    // Check if current route is in any submenu and open that parent if so
    menuData.forEach((menuItem) => {
      if (menuItem.subMenu) {
        menuItem.subMenu.forEach((subItem) => {
          if (subItem.link === location.pathname) {
            setOpenParent(menuItem.id);
          }
        });
      }
    });
  }, [location.pathname]);

  return (
    <div className="sidebar w-64 bg-gray-800 text-white h-full">
      <ul className="w-full">
        {menuData.map((item) => (
          <li key={item.id} className="w-full">
            {item.subMenu ? (
              <>
                <div
                  onClick={() =>
                    setOpenParent((prev) => (prev === item.id ? null : item.id))
                  }
                  className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
                    openParent === item.id ? "bg-gray-700" : ""
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                  <ArraowDownIcon
                    className={`ml-auto w-3 h-3 transition-transform ${
                      openParent === item.id ? "rotate-0" : "rotate-90"
                    }`}
                  />
                </div>
                <ul className={`${openParent === item.id ? "block" : "hidden"} pl-4`}>
                  {item.subMenu.map((subItem) => (
                    <li key={subItem.id} className="w-full">
                      <Link
                        to={subItem.link}
                        className={`flex items-center p-2 hover:bg-gray-600 ${
                          subItem.link === location.pathname ? "bg-red-600" : ""
                        }`}
                      >
                        {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                        <span>{subItem.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link
                to={item.link}
                className={`flex items-center p-2 hover:bg-gray-700 ${
                  item.link === location.pathname ? "bg-red-600" : ""
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
