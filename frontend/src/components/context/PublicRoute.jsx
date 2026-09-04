import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    const storedSession = localStorage.getItem("polar_twin_user");
    
    // If the user is logged in, bounce them away from /auth and / to the dashboard
    if (storedSession && storedSession !== "undefined") {
        return <Navigate to="/dashboard" replace />;
    }

    // Otherwise, let them see the Auth or Home page
    return children;
}