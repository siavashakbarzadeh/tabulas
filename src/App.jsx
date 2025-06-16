import Router from "./route";
import {AuthProvider} from "./contexts/AuthContext.jsx";

function App() {
    return <AuthProvider>
        <Router/>
    </AuthProvider>;
}

export default App
