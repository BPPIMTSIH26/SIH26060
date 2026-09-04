import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
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

    // If there is NO session, kick them out to the login screen
    if (!session) {
        return <Navigate to="/auth" replace />;
    }

    // If they are logged in, let them view the dashboard layout
    return children;
}