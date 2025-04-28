/* NewLoginPage.jsx — versione Expo */

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link, useNavigate } from "react-router-dom";   // solo se usi React-Router v6 web-style in RN; altrimenti sostituisci
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "../../configs/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import msalConfig from "../../configs/msalConfig";   // se usi MSAL per il login Microsoft

// chiude la web-view di login al ritorno

const CLIENT_ID = msalConfig.auth.clientId;
const AUTHORITY = msalConfig.auth.authority;
const TENANT_ID = AUTHORITY.split("/").at(-1);
const DISCOVERY = `${AUTHORITY}/v2.0`;
const SCOPES = ["openid", "profile", "email"];
const REDIRECT_SCHEME = "tabulas";
WebBrowser.maybeCompleteAuthSession();                      // deve corrispondere a app.json > scheme

function NewLoginPage() {
  /* stato formulario email/password */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* auth context */
  const { login, logout: localLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* ───────────────────────── 1. AUTO-LOGOUT ───────────────────────── */
  useEffect(() => {
    if (isAuthenticated) localLogout();
  }, []);

  /* ───────────────────────── 2. OAUTH REQUEST SETUP ───────────────────────── */
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: REDIRECT_SCHEME,          // myapp://redirect
    // useProxy: AuthSession.isAvailableAsync() dev proxy -> opzionale
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [...SCOPES, "offline_access"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,   // code + PKCE
    },
    {
      authorizationEndpoint: `${DISCOVERY}/authorize`,
      tokenEndpoint: `${DISCOVERY}/token`
    }
  );

  /* ───────────────────────── 3. GESTIONE RISPOSTA OAUTH ───────────────────────── */
  useEffect(() => {
    (async () => {
      if (response?.type !== "success") return;

      try {
        /* step A: recupero codice */
        const { code } = response.params;

        /* step B: exchange code→token con Azure (PKCE) */
        const { access_token, id_token } = await AuthSession.exchangeCodeAsync(
          {
            clientId: CLIENT_ID,
            code,
            redirectUri,
            scopes: SCOPES.join(" "),
            extraParams: { code_verifier: request.codeVerifier }
          },
          { tokenEndpoint: `${DISCOVERY}/token` }
        );

        /* step C: invio id_token (o access_token) al backend */
        const res = await axios.post("/login/microsoft", {
          id_token,
        });

        login(res.data.data.token);          // salvo token app
        navigate("/");                       // redirect home
      } catch (err) {
        console.error("Token exchange failed", err);
        toast.error("Microsoft login failed", { position: "bottom-right", hideProgressBar: true });
      }
    })();
  }, [response]);

  /* ───────────────────────── 4. LOGIN EMAIL/PASSWORD ───────────────────────── */
  const handlePasswordLogin = () => {
    axios.post("login", { email, password })
      .then(res => { login(res.data.data.token); navigate("/"); })
      .catch(err => {
        const msg =
          err.response?.status === 422
            ? Object.values(err.response.data.errors).flat().join(" ")
            : err.response?.data?.data?.message || "Login failed";
        toast.error(msg, { position: "bottom-right", hideProgressBar: true });
      });
  };

  /* ───────────────────────── 5. RENDER ───────────────────────── */
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {/* sinistra: form */}
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        {/* pulsante Microsoft */}
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync({ useProxy: false })}   // usa proxy true in dev se vuoi
          style={{ height: 44, borderWidth: 1, borderColor: "#000", alignItems: "center", justifyContent: "center", marginBottom: 16 }}
        >
          <Text>Accedi con Microsoft</Text>
        </TouchableOpacity>

        {/* separatore */}
        <View style={{ alignItems: "center", marginVertical: 8 }}>
          <Text>— Oppure —</Text>
        </View>

        {/* email/password */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={{ height: 44, borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={{ height: 44, borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 }}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handlePasswordLogin}
          style={{ height: 46, backgroundColor: "#B83D62", alignItems: "center", justifyContent: "center", borderRadius: 4 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>ACCEDI</Text>
        </TouchableOpacity>

        {/* link “hai dimenticato la password?” */}
        <Link to="/forgot-password">
          <Text style={{ marginTop: 12, color: "#B83D62" }}>Hai dimenticato la password?</Text>
        </Link>
      </View>

      {/* destra: grafica (solo tablet/web) */}
      {/* in RN puoi omettere o usare Platform.select */}
    </View>
  );
}

export default NewLoginPage;
