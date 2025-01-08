import { Link } from "react-router-dom";
import User from "../../icons/User";
import ChatIcon from "../../icons/Chat";
import PaperIcon from "../../icons/Paper";
import ArraowDownIcon from "../../icons/ArraowDown";

function Menu2() {
  return (
    /*  opacity-70 inactive class */
    <ul className="w-full mt-4">
      <li className="w-full">
        <div className="w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer">
          <PaperIcon className="w-6 h-6" />
          <span>Assemblea</span>
          <ArraowDownIcon className="w-2.5" />
        </div>
        <ul className="w-full space-y-1 rounded-xl overflow-hidden">
          <li className="w-full">
            <Link className="w-full h-10 flex items-center px-2 text-white bg-white/5">
              Assemblea - 1
            </Link>
          </li>
          <li className="w-full">
            <Link className="w-full h-10 flex items-center px-2 text-white bg-white/5">
              Assemblea - 2
            </Link>
          </li>
          <li className="w-full">
            <Link className="w-full h-10 flex items-center px-2 text-white bg-white/5">
              Assemblea - 3
            </Link>
          </li>
          <li className="w-full">
            <Link className="w-full h-10 flex items-center px-2 text-white bg-white/5">
              Assemblea - 4
            </Link>
          </li>
        </ul>
      </li>
      <li className="w-full">
        <Link className="w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer">
          <User className="w-6 h-6" />
          <span>Commissioni permanenti</span>
        </Link>
      </li>
      <li className="w-full">
        <Link className="w-full h-10 flex items-center space-x-2 px-2 text-sm text-white cursor-pointer">
          <ChatIcon className="w-6 h-6" />
          <span>Giunte e altre comissioni</span>
        </Link>
      </li>
    </ul>
  );
}

export default Menu2;
