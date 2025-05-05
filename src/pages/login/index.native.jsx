import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { PublicClientApplication } from "react-native-msal";
import * as SecureStore from "expo-secure-store";
import axios from "../../configs/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native"; // se usi react-navigation

/*──────────────────────── CONFIG ────────────────────────*/
const pca = new PublicClientApplication({
  auth: {
    clientId:   "aa825561-377d-4414-8acc-2905cd587e98",
    authority:  "https://login.microsoftonline.com/16c24428-0bd3-4bc1-a192-d315f43f5bb4",
    redirectUri:"msauth://com.yourcompany.tabulas/HASH_BASE64_URL"
  }
});
const SCOPES = ["openid", "profile", "email"];
/*─────────────────────────────────────────────────────────*/

export default function NewLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, logout, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  /* auto-logout se utente già loggato */
  useEffect(() => { if (isAuthenticated) logout(); }, []);

  /*────────── LOGIN MICROSOFT ──────────*/
  const handleMicrosoftLogin = async () => {
    try {
      const result = await pca.acquireToken({
        scopes: SCOPES,
        promptType: "SELECT_ACCOUNT"        // facoltativo
      });

      /* opzionale: salva refreshToken con SecureStore */
      await SecureStore.setItemAsync("msalAccountId", result.accountIdentifier);

      /* invia id_token al backend */
      const res = await axios.post("/login/microsoft", {
        id_token: result.idToken
      });

      login(res.data.data.token);
      navigation.navigate("Home");
    } catch (err) {
      console.warn("MSAL error", err);
      Alert.alert("Errore", "Accesso con Microsoft non riuscito.");
    }
  };

  /*────────── LOGIN EMAIL/PWD ──────────*/
  const handlePasswordLogin = () => {
    axios.post("login", { email, password })
      .then(res => { login(res.data.data.token); navigation.navigate("Home"); })
      .catch(() => Alert.alert("Errore", "Credenziali non valide"));
  };

  /*────────── UI ──────────*/
  return (
    <View style={{ flex:1, justifyContent:"center", padding:24 }}>
      <TouchableOpacity
        onPress={handleMicrosoftLogin}
        style={{ height:46, borderWidth:1, justifyContent:"center", alignItems:"center", marginBottom:16 }}
      >
        <Text>Accedi con Microsoft</Text>
      </TouchableOpacity>

      <Text style={{ textAlign:"center", marginVertical:8 }}>— Oppure —</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth:1, marginBottom:12, padding:8, height:44 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, marginBottom:12, padding:8, height:44 }}
      />

      <TouchableOpacity
        onPress={handlePasswordLogin}
        style={{ height:46, backgroundColor:"#B83D62", justifyContent:"center", alignItems:"center", borderRadius:4 }}
      >
        <Text style={{ color:"#fff", fontWeight:"bold" }}>ACCEDI</Text>
      </TouchableOpacity>
    </View>
  );
}
