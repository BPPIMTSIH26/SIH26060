import { Navigate } from "react-router-dom";
import { USE_MOCK_API } from "../../services/config"; // Adjust path if necessary

export default function PublicRoute({ children }) {
    // 🛑 DEV TOGGLE: Prevents bouncing you away from /auth so you can test the login screen
    if (USE_MOCK_API) return children; 

    const storedSession = localStorage.getItem("polar_twin_user");
    
    if (storedSession && storedSession !== "undefined") {
        return <Navigate to="/" replace />;
    }

    return children;
}