import { Link, useLocation } from "react-router-dom";
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
import { useState, useEffect } from "react";
import axios from "../../configs/axiosConfig.js";

const Menu2 = ({ activeNode, setActiveNode }) => {
  const [active, setActive] = useState(null);
  const [docNodes, setDocNodes] = useState([]);
  const location = useLocation(); // Detect current page

  useEffect(() => {
    if (location.pathname === "/ultimiatti") {
      fetchData();
    }
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      const res = await axios.get("tabulas/mobile/ultimiatti");
      setDocNodes(res.data.docNodes || []);
    } catch (err) {
      console.error("Error fetching doc nodes", err);
    }
  };

  const toggleMenuHandler = (id) => () => {
    setActive((prev) => (prev === id ? null : id));
  };

  const DefaultMenu = [
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
        { id: 7, title: "Commissioni", icon: <UsersIcon className="w-6 h-6" />, link: "/commissioni" },
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

  return (
    <ul className="w-full mt-4">
      {/* Switch Menu if on Ultimi Atti */}
      {location.pathname !== "/ultimiatti"
        ? DefaultMenu.map((item) => (
            <li key={item.id} className="w-full">
              {item.subMenu ? (
                <div
                  onClick={toggleMenuHandler(item.id)}
                  className="w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ArraowDownIcon className={`w-2.5 transition-transform duration-150 ${active === item.id ? "" : "-rotate-90"}`} />
                </div>
              ) : (
                <Link to={item.link} className="w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer">
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
              {item.subMenu && (
                <ul className={`w-full ${active === item.id ? "" : "hidden"} space-y-1 rounded-xl overflow-hidden`}>
                  {item.subMenu.map((subItem) => (
                    <li key={subItem.id} className="w-full">
                      <Link to={subItem.link} className="w-full h-10 flex items-center px-2 text-white bg-white/5 space-x-2">
                        {subItem.icon && <span>{subItem.icon}</span>}
                        <span>{subItem.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        : docNodes.length > 0 && (
            <li className="w-full">
              <div className="w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer">
                <LatestActsIcon className="w-6 h-6" />
                <span>Ultimi Atti</span>
              </div>
              <ul className="w-full space-y-1 rounded-xl overflow-hidden">
                {docNodes.map((node, key) => (
                  <li key={key} className="w-full">
                    <button
                      onClick={() => setActiveNode(node.name)}
                      className={`w-full h-10 flex items-center px-2 text-white bg-white/5 space-x-2 ${
                        activeNode === node.name ? "bg-red-600 text-white" : ""
                      }`}
                    >
                      <span>{node.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          )}
    </ul>
  );
};

export default Menu2;
