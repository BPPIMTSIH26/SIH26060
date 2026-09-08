
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const location = useLocation();

    const storedSession =
        localStorage.getItem("polar_twin_user");

    let session = null;

    /* ============================================================
       PARSE STORED SESSION
       ============================================================ */

    if (
        storedSession &&
        storedSession !== "undefined" &&
        storedSession !== "null"
    ) {
        try {
            const parsedSession =
                JSON.parse(storedSession);

            if (
                parsedSession &&
                typeof parsedSession === "object"
            ) {
                session = parsedSession;
            }
        } catch (error) {
            console.error(
                "Failed to parse session data.",
                error
            );

            localStorage.removeItem(
                "polar_twin_user"
            );
        }
    }

    /* ============================================================
       PROTECTED ROUTE
       ============================================================ */

    if (!session) {
        return (
            <Navigate
                to="/auth"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    /* ============================================================
       AUTHENTICATED USER
       ============================================================ */

    return children;
}
