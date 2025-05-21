import Router from "./route";
import {AuthProvider} from "./contexts/AuthContext.jsx";
import CordovaAutoLogin from "./pages/login/CordovaAutoLogin.jsx";


function App() {
    return <AuthProvider>
        {/* <CordovaAutoLogin/> */}
        <Router/>
    </AuthProvider>;
}

export default App
