import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header/Header";

export default function Layout() {
    const getInitialStation = () => {
        try {
            const stored =
                localStorage.getItem(
                    "polar_twin_user"
                );

            if (!stored) {
                return "Maitri";
            }

            const user =
                JSON.parse(stored);

            if (
                user?.role ===
                "Station Manager"
            ) {
                return (
                    user.station ===
                        "BHARATI"
                        ? "Bharati"
                        : "Maitri"
                );
            }
        } catch {
            // Fall back below.
        }

        return "Maitri";
    };

    const [activeStation, setActiveStation] =
        useState(getInitialStation);

    useEffect(() => {
        const syncStation = () => {
            try {
                const stored =
                    localStorage.getItem(
                        "polar_twin_user"
                    );

                if (!stored) return;

                const user =
                    JSON.parse(stored);

                if (
                    user.role ===
                    "Station Manager"
                ) {
                    setActiveStation(
                        user.station ===
                            "BHARATI"
                            ? "Bharati"
                            : "Maitri"
                    );
                }
            } catch {
                // Ignore malformed local state.
            }
        };

        window.addEventListener(
            "storage",
            syncStation
        );

        syncStation();

        return () =>
            window.removeEventListener(
                "storage",
                syncStation
            );
    }, []);

    return (
        <div className="min-h-screen bg-amber-50 dark:bg-slate-950">
            <Header
                activeStation={
                    activeStation
                }
                setActiveStation={
                    setActiveStation
                }
            />

            <main>
                <Outlet
                    context={{
                        activeStation,
                    }}
                />
            </main>
        </div>
    );
}