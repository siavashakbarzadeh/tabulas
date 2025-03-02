import { Link } from "react-router-dom";
import User from "../../icons/User";
import ChatIcon from "../../icons/Chat";
import PaperIcon from "../../icons/Paper";
import ArraowDownIcon from "../../icons/ArraowDown";
import { useState } from "react";

const Menu = [
  {
    id: 1,
    title: "Assemblea",
    icon: <PaperIcon className="w-6 h-6" />,
    subMenu: [
      {
        id: 1,
        title: "Confirm",
        link: "/test/confirm",
      },
      {
        id: 2,
        title: "Email",
        link: "/test/email",
      },
      {
        id: 3,
        title: "Form",
        link: "/test/form",
      },
      {
        id: 4,
        title: "Services",
        link: "/test/services",
      },
      {
        id: 5,
        title: "Guidemanuali",
        link: "/test/guidemanuali",
      },
      {
        id: 6,
        title: "Ebook",
        link: "/test/ebook",
      },
      {
        id: 7,
        title: "Commissioni",
        link: "/test/commissioni",
      },
      {
        id: 8,
        title: "Ultimiatti",
        link: "/test/ultimiatti",
      },
      {
        id: 8,
        title: "Ultimdossier",
        link: "/test/ultimdossier",
      },
    ],
  },
  {
    id: 2,
    title: "Commissioni permanenti",
    icon: <User className="w-6 h-6" />,
    link: "/commissioni-permanenti",
  },
  {
    id: 3,
    title: "Giunte e altre comissioni",
    icon: <ChatIcon className="w-6 h-6" />,
    link: "/giunte-e-altre-comissioni",
  },
];

function Menu2() {
  const [active, setActive] = useState(null);

  const toggleMenuHandler = (id) => () => {
    setActive((prev) => (prev === id ? null : id));
  };

  return (
    /*  opacity-70 inactive class */
    <ul className="w-full mt-4">
      {Menu.map((item) => (
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
            <Link
              to={item.link}
              className="w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          )}
          {item.subMenu && (
            <ul className={`w-full ${active === item.id ? "" : "hidden"} space-y-1 rounded-xl overflow-hidden`}>
              {item.subMenu.map((subItem) => (
                <li key={subItem.id} className="w-full">
                  <Link
                    to={subItem.link}
                    className="w-full h-10 flex items-center px-2 text-white bg-white/5"
                  >
                    {subItem.title}
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
