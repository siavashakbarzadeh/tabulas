import { Link } from "react-router-dom";
import LogoImage from "../../../assets/svg/logo.svg";
import Logo2Image from "../../../assets/svg/logo2.svg";
import CheckIcon from "../../../icons/Check";
import MicrosoftIcom from "../../../icons/Microsoft";

function LoginTestPage() {
  return (
    <div className="flex w-full">
      <div className="w-full lg:w-1/2 bg-white flex items-center">
        <div className="w-full md:w-10/12 flex flex-col mx-auto py-4 md:py-2 px-2 md:px-0">
          <div className="w-full flex justify-center">
            <Link className="flex">
              {/* <img src={Logo2Image} alt="Logo" className="h-15" /> */}
            </Link>
          </div>
          <div className="w-full">
              <button className="w-full flex justify-center items-center h-11 relative border border-zinc-900 rounded-md">
                <MicrosoftIcom className="size-5 absolute left-4 top-1/2 -translate-y-1/2" />
                <span className="font-medium text-sm">Accedi con Microsoft</span>
              </button>
            </div>
            <div className="w-full relative h-6 before:content-[''] before:h-px before:absolute before:left-0 before:right-0 before:top-1/2 before:-translate-y-1/2 before:bg-gray-100">
              <span className="px-3 bg-white text-sm font-semibold leading-6 text-zinc-900 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">Or</span>
            </div>
          <div className="mt-5">
            <div className="text-xl font-medium leading-6">ACCEDI</div>
            <p className="leading-7 text-zinc-700 font-light mt-2">
              Puoi effettuare l'accesso qui con il tuo nome utente e password o
              utilizzando il pulsante sopra utilizzando l'applicazione fortinet
            </p>
          </div>
          <div className="w-full space-y-5 mt-8">
            <div className="w-full flex flex-col">
              <label
                htmlFor="email"
                className="text-sm text-zinc-900 font-medium mb-1"
              >
                La tua email o il tuo codice cliente
              </label>
              <input
                type="email"
                id="email"
                className="h-12 px-4 bg-gray-100 text-sm border-none ring-0 outline-none focus:border-none focus:ring-0 focus:outline-none"
                placeholder="Email"
              />
            </div>
            <div className="w-full flex flex-col">
              <div className="w-full flex justify-between mb-1">
                <label
                  htmlFor="password"
                  className="text-sm text-zinc-900 font-medium leading-6"
                >
                  Password
                </label>
                <Link className="text-sm text-primary-900 font-medium leading-6">
                  Hai dimenticato la password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                className="h-12 px-4 bg-gray-100 text-sm border-none ring-0 outline-none focus:border-none focus:ring-0 focus:outline-none"
                placeholder="Password"
              />
            </div>
            <div className="w-full flex">
              <label className="flex relative gap-2">
                <input
                  type="checkbox"
                  className="absolute left-0 top-0 w-0 h-0 invisible peer"
                />
                <span className="size-4.5 flex items-center justify-center bg-gray-100 rounded-sm peer-checked:bg-primary-900 peer-checked:[&>*]:block">
                  <CheckIcon className="size-3.5 text-white hidden" />
                </span>
                <span className="text-sm font-medium text-zinc-900 leading-4.5">
                  Ricordati di me
                </span>
              </label>
            </div>
            <div className="w-full">
              <button className="w-full h-12 bg-primary-900 text-white flex justify-center items-center rounded-lg transition-colors hover:bg-primary-950">
                ACCEDI
              </button>
            </div>
            
         
          </div>
        </div>
      </div>
      <div className="w-1/2 hidden lg:flex flex-col justify-center items-center bg-gradient-to-b from-[#B83D62] to-primary-900">
        <div className="w-full flex justify-center relative pb-28 overflow-x-clip">
          <span className="size-12 absolute right-2 top-0 -translate-y-[25%] bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-xl"></span>
          <span className="size-5 blur-sm absolute right-[30%] top-0 -translate-y-[25%] translate-x-1/2 bg-primary-900/50 block rounded-md"></span>
          <span className="size-12 absolute left-[20%] top-0 -translate-y-[15%] -translate-x-1/2 bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-xl"></span>
          <span className="size-20 absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-xl"></span>
          <span className="size-5 blur-sm absolute right-[5%] top-1/2 -translate-y-1/2 translate-x-1/2 bg-primary-900/50 block rounded-md"></span>
          <span className="size-14 absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-xl"></span>
          <span className="size-5 blur-sm absolute left-[5%] top-[30%] -translate-y-1/2 translate-x-1/2 bg-primary-900/50 block rounded-md"></span>
          <span className="size-8 blur-sm absolute right-[10%] top-[80%] -translate-y-1/2 translate-x-1/2 bg-primary-900/50 block rounded-md"></span>
          <span className="size-8 absolute right-[28%] top-[92%] -translate-y-1/2 translate-x-1/2 bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-md"></span>
          <span className="size-16 absolute right-[47%] top-[75%] -translate-y-1/2 translate-x-1/2 bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-md"></span>
          <span className="size-12 absolute right-[65%] top-[85%] -translate-y-1/2 translate-x-1/2 bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-md"></span>
          <span className="size-9 absolute right-[82%] top-[83%] -translate-y-1/2 translate-x-1/2 bg-gradient-to-t from-primary-900/40 to-primary-900/20 block rounded-md"></span>
          <div className="size-20 flex justify-center items-center bg-gradient-to-t from-primary-900/40 to-primary-900/20 rounded-xl">
            <span className="size-8 blur-sm absolute right-full top-[80%] -translate-y-1/2 translate-x-1/2 bg-primary-900/50 block rounded-md"></span>
            <img src={LogoImage} alt="Logo" className="size-16" />
          </div>
        </div>
        <div className="w-10/12 pt-8">
          <span className="text-white text-sm leading-6">Tabulas</span>
          <p className="text-white text-base leading-8 font-light">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginTestPage;
