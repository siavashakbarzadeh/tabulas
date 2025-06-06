import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const CordovaAutoLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
        const fakeToken = "dev-token";
        const fakeUser = {
          name: "Cordova Dev User",
          email: "dev@mobile.app",
          roles: ["admin"],
          id: 9999,
        };

        login(fakeToken, fakeUser);
        navigate("/");
      },
      { once: true }
    );

};

export default CordovaAutoLogin;
