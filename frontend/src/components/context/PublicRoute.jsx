import {
    Navigate,
} from "react-router-dom";

const hasStoredSession = () => {
    const storedSession =
        localStorage.getItem(
            "polar_twin_user"
        );

    if (
        !storedSession ||
        storedSession === "undefined" ||
        storedSession === "null"
    ) {
        return false;
    }

    try {
        const session =
            JSON.parse(
                storedSession
            );

        return Boolean(
            session &&
            typeof session ===
                "object" &&
            (
                session.email ||
                session.fullName ||
                session.username
            )
        );
    } catch (error) {
        console.error(
            "Failed to parse public-route session.",
            error
        );

        localStorage.removeItem(
            "polar_twin_user"
        );

        return false;
    }
};

export default function PublicRoute({
    children,
}) {
    const authenticated =
        hasStoredSession();

    /*
     * Authenticated users should never
     * remain on /auth.
     */

    if (authenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}