import { Link, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { toast } from "react-toastify";

function NewLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { instance, accounts } = useMsal();
  const { login, logout: localLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * Auto logout on page load if already logged in
   */
  useEffect(() => {
    if (isAuthenticated) {
      localLogout();
    }

    if (accounts.length > 0) {
      instance.logoutPopup().catch((err) => {
        console.error("MSAL logout failed:", err);
      });
    }
  }, []);

  /**
   * Handle normal email/password login
   */
  const handleLogin = () => {
    axios
      .post("login", {
        email,
        password,
      })
      .then(async (response) => {
        await login(response.data.data.token);


          // 👉 Mobile – likely opened from React Native

          navigate('/');

      })
      .catch((error) => {
        if (error.response?.status === 422) {
          const responseErrors = error.response.data.errors;
          const errors = [];
          Object.keys(responseErrors).forEach((key) => {
            const item = responseErrors[key];
            if (item && item.length) {
              errors.push(item[0]);
            }
          });

          toast.error(errors.join(" "), {
            position: "bottom-right",
            hideProgressBar: true,
          });
        } else {
          toast.error(error.response?.data?.data?.message || "Login failed", {
            position: "bottom-right",
            hideProgressBar: true,
          });
        }
      });
  };

  /**
   * Handle Microsoft login via MSAL popup
   */
  const handleMicrosoftLogin = () => {
    const loginRequest = {
      scopes: ["api://aa825561-377d-4414-8acc-2905cd587e98/Roles.Read"],
    };
  
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        const idToken = response.idToken;
  
        axios
          .post("/login/microsoft", { id_token: idToken })
          .then(async (res) => {
            const token = res.data.data.token;
  
            // 👇 Replace this part with deep link redirect
            const payload = {
              "auth-token": token,
              "__web_blob__": JSON.stringify(res.data.data),
            };
  
            const encoded = btoa(JSON.stringify(payload));
            const deepLink = `tabulas://storage?data=${encoded}`;
  
            window.location.href = deepLink; // 👈 Redirect to mobile app
  
          })
          .catch((err) => {
            toast.error(
              err.response?.data?.data?.message || "Microsoft login failed",
              {
                position: "bottom-right",
                hideProgressBar: true,
              }
            );
          });
      })
      .catch((error) => {
        console.error("MSAL loginPopup error", error);
        toast.error("Could not sign in with Microsoft.", {
          position: "bottom-right",
          hideProgressBar: true,
        });
      });
  };
  


  

  return (
    <div className="flex w-full">
      {/* Left side: login form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center">
        <div className="w-full md:w-10/12 flex flex-col mx-auto py-4 md:py-2 px-2 md:px-0">
          <div className="w-full flex justify-center">
            {/* place your logo or branding here */}
          </div>

          {/* Microsoft login button */}
          <div className="w-full mb-4">
            {accounts.length ? (
              <button onClick={() => instance.logoutPopup()}>
                Logout from MSAL
              </button>
            ) : (
              <button
                onClick={handleMicrosoftLogin}
                className="w-full flex justify-center items-center h-11 border border-zinc-900 rounded-md"
              >
                <span className="font-medium text-sm">
                  Accedi con Microsoft
                </span>
              </button>
            )}
          </div>

          <div className="w-full relative h-6 before:content-[''] before:h-px before:absolute before:left-0 before:right-0 before:top-1/2 before:-translate-y-1/2 before:bg-gray-100">
            <span className="px-3 bg-white text-sm font-semibold text-zinc-900 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              O
            </span>
          </div>

          {/* Email/password login form */}
          <div className="mt-5">
            <div className="text-xl font-medium leading-6">ACCEDI</div>
            <p className="leading-7 text-zinc-700 font-light mt-2">
              Puoi effettuare l'accesso qui con il tuo nome utente e password
              oppure utilizzare l'applicazione Microsoft.
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 bg-gray-100 text-sm border-none outline-none"
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
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-900 font-medium leading-6"
                >
                  Hai dimenticato la password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                className="h-12 px-4 bg-gray-100 text-sm border-none outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* "Remember me" checkbox */}
            <div className="w-full flex">
              <label className="flex relative gap-2">
                <input
                  type="checkbox"
                  className="absolute left-0 top-0 w-0 h-0 invisible peer"
                />
                <span className="size-4.5 flex items-center justify-center bg-gray-100 rounded-sm peer-checked:bg-primary-900 peer-checked:[&>*]:block">
                  {/* Custom check icon can go here */}
                </span>
                <span className="text-sm font-medium text-zinc-900 leading-4.5">
                  Ricordati di me
                </span>
              </label>
            </div>

            {/* Submit for normal login */}
            <div className="w-full">
              <button
                onClick={handleLogin}
                className="w-full h-12 bg-primary-900 text-white flex justify-center items-center rounded-lg hover:bg-primary-950"
              >
                ACCEDI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: your design/branding */}
      <div className="w-1/2 hidden lg:flex flex-col justify-center items-center bg-gradient-to-b from-[#B83D62] to-primary-900">
        {/* ... background/design elements go here ... */}
      </div>
    </div>
  );
}

export default NewLoginPage;
