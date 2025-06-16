import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link, useNavigate } from "react-router-dom";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "../../configs/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import msalConfig from "../../configs/msalConfig";

const CLIENT_ID = msalConfig.auth.clientId;
const AUTHORITY = msalConfig.auth.authority;
const TENANT_ID = AUTHORITY.split("/").at(-1);
const DISCOVERY = `${AUTHORITY}/v2.0`;
const SCOPES = ["openid", "profile", "email", "offline_access"];
const REDIRECT_URI = "tabulas://auth";  // ✅ Your registered URI

WebBrowser.maybeCompleteAuthSession();

function NewLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, logout: localLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) localLogout();
  }, []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
    },
    {
      authorizationEndpoint: `${DISCOVERY}/authorize`,
      tokenEndpoint: `${DISCOVERY}/token`,
    }
  );

  useEffect(() => {
    (async () => {
      if (response?.type !== "success") return;

      try {
        const { code } = response.params;

        const { access_token, id_token } = await AuthSession.exchangeCodeAsync(
          {
            clientId: CLIENT_ID,
            code,
            redirectUri: REDIRECT_URI,
            scopes: SCOPES.join(" "),
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          {
            tokenEndpoint: `${DISCOVERY}/token`,
          }
        );

        const res = await axios.post("/login/microsoft", { id_token });

        login(res.data.data.token);
        navigate("/");
      } catch (err) {
        console.error("Token exchange failed", err);
        toast.error("Microsoft login failed", {
          position: "bottom-right",
          hideProgressBar: true,
        });
      }
    })();
  }, [response]);

  const handlePasswordLogin = () => {
    axios
      .post("login", { email, password })
      .then((res) => {
        login(res.data.data.token);
        navigate("/");
      })
      .catch((err) => {
        const msg =
          err.response?.status === 422
            ? Object.values(err.response.data.errors).flat().join(" ")
            : err.response?.data?.data?.message || "Login failed";
        toast.error(msg, { position: "bottom-right", hideProgressBar: true });
      });
  };

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync({ useProxy: false })}
          style={{
            height: 44,
            borderWidth: 1,
            borderColor: "#000",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text>Accedi con Microsoft</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginVertical: 8 }}>
          <Text>— Oppure —</Text>
        </View>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={{
            height: 44,
            borderWidth: 1,
            marginBottom: 12,
            paddingHorizontal: 8,
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={{
            height: 44,
            borderWidth: 1,
            marginBottom: 12,
            paddingHorizontal: 8,
          }}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handlePasswordLogin}
          style={{
            height: 46,
            backgroundColor: "#B83D62",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>ACCEDI</Text>
        </TouchableOpacity>

        <Link to="/forgot-password">
          <Text style={{ marginTop: 12, color: "#B83D62" }}>
            Hai dimenticato la password?
          </Text>
        </Link>
      </View>
    </View>
  );
}

export default NewLoginPage;
