import { Navigate } from "react-router-dom";
import { USE_MOCK_API } from "../../services/config"; // Adjust path if necessary

export default function ProtectedRoute({ children }) {
    // 🛑 DEV TOGGLE: Instantly grants access while building UI
    if (USE_MOCK_API) return children; 

    const storedSession = localStorage.getItem("polar_twin_user");
    let session = null;

    if (storedSession && storedSession !== "undefined") {
        try {
            session = JSON.parse(storedSession);
        } catch (error) {
            console.error("Failed to parse session data.", error);
            localStorage.removeItem("polar_twin_user"); 
        }
    }

    if (!session) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}