import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const isCordova = () => typeof window !== "undefined" && window.cordova;

export default function CordovaAutoLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isCordova = typeof window !== "undefined" && window.cordova;
    if (!isCordova) return;
  
    const fakeToken = "dev-token";
    const fakeUser = {
      name: "Cordova Dev User",
      email: "dev@mobile.app",
      roles: ["admin"],
      id: 9999,
    };
  
    login(fakeToken, fakeUser);
    navigate("/");
  }, []);
  

  return null;
}

