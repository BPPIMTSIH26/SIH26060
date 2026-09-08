import { useEffect, useRef, useState } from "react";
import {
    NavLink,
    Link,
    useNavigate,
} from "react-router-dom";

import Logo from "../../../public/Logo";
import {
    UserRound,
    Settings,
    LogOut,
    Menu,
    X,
    MapPin,
    KeyRound,
} from "lucide-react";

import ThemeToggle from "../context/ThemeToggle";
import AlertsDropdown from "../context/Alerts/AlertsDropdown";
import { useToast } from "../context/ToastContext";
import { authAPI } from "../../services/api/auth.js";

const navLinks = [
    {
        label: "Dashboard",
        to: "/dashboard",
    },
    {
        label: "Infrastructure",
        to: "/infrastructure",
    },
    {
        label: "Environment",
        to: "/environment",
    },
    {
        label: "Energy & Power",
        to: "/energypower",
    },
    {
        label: "Logistics",
        to: "/logistics",
    },
    {
        label: "Requisitions",
        to: "/requisitions",
    },
];

const ROLE_LABELS = {
    "NCPOR Operator":
        "NCPOR Operator",

    "Station Manager":
        "Station Manager",

    "Logistics Manager":
        "Logistics Manager",
};

export default function Header({
    alerts = [],
    activeStation,
    setActiveStation,
}) {
    const [userOpen, setUserOpen] =
        useState(false);

    const [menuOpen, setMenuOpen] =
        useState(false);

    const dropdownRef =
        useRef(null);

    const navigate = useNavigate();
    const showToast = useToast();

    const [user, setUser] =
        useState({
            name: "Operator",
            email: "",
            role: "NCPOR Operator",
            station: null,
        });

    useEffect(() => {
        const stored =
            localStorage.getItem(
                "polar_twin_user"
            );

        if (
            stored &&
            stored !== "undefined"
        ) {
            try {
                setUser(
                    JSON.parse(stored)
                );
            } catch {
                localStorage.removeItem(
                    "polar_twin_user"
                );
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (
            event
        ) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setUserOpen(false);
            }
        };

        if (userOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [userOpen]);

    const isStationManager =
        user.role ===
        "Station Manager";

    const formatRole = (role) =>
        ROLE_LABELS[role] ||
        role ||
        "Operator";

    const handleLogout =
        async () => {
            try {
                await authAPI.logout();
            } catch {
                // Local session must still be cleared.
            }

            localStorage.removeItem(
                "polar_twin_user"
            );

            setUserOpen(false);
            setMenuOpen(false);

            showToast(
                "Session securely terminated.",
                "info"
            );

            navigate(
                "/auth",
                {
                    replace: true,
                }
            );
        };

    const changeStation = (
        station
    ) => {
        setActiveStation(
            station
        );

        setMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-amber-50 dark:bg-slate-900 border-b border-amber-200/60 dark:border-slate-700 font-sans">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div className="flex-1 flex justify-start">
                        <Logo />
                    </div>

                    <div className="hidden sm:flex justify-center">
                        {isStationManager ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-100/50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-full text-cyan-700 dark:text-cyan-400 text-sm font-bold uppercase">
                                <MapPin className="w-4 h-4" />
                                {activeStation}
                            </div>
                        ) : (
                            <div className="flex items-center bg-amber-200/40 dark:bg-slate-950 rounded-full p-1 border border-amber-300/50 dark:border-slate-700">
                                {[
                                    "Maitri",
                                    "Bharati",
                                ].map((station) => (
                                    <button
                                        key={station}
                                        type="button"
                                        onClick={() =>
                                            changeStation(
                                                station
                                            )
                                        }
                                        className={`px-5 py-1.5 rounded-full text-sm font-semibold ${
                                            activeStation ===
                                            station
                                                ? "bg-cyan-500 text-white dark:text-slate-900"
                                                : "text-gray-600 dark:text-slate-400"
                                        }`}
                                    >
                                        {station}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
                        <ThemeToggle />

                        <AlertsDropdown
                            alerts={alerts}
                            activeStation={
                                activeStation
                            }
                        />

                        <div className="hidden md:block text-right">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </div>

                            <div className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                                {formatRole(
                                    user.role
                                )}
                            </div>
                        </div>

                        <div
                            className="relative"
                            ref={dropdownRef}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setUserOpen(
                                        (prev) =>
                                            !prev
                                    )
                                }
                                className="h-10 w-10 rounded-full bg-amber-100 dark:bg-slate-700 flex items-center justify-center border-2 border-amber-300 dark:border-slate-500"
                            >
                                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                                    {(
                                        user.name ||
                                        "OP"
                                    )
                                        .slice(
                                            0,
                                            2
                                        )
                                        .toUpperCase()}
                                </span>
                            </button>

                            {userOpen && (
                                <div className="absolute right-0 top-12 mt-2 w-60 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">

                                    <div className="px-4 py-3 border-b border-amber-200 dark:border-slate-700">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {
                                                user.name
                                            }
                                        </p>

                                        <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                                            {
                                                user.email
                                            }
                                        </p>

                                        <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                                            {formatRole(
                                                user.role
                                            )}
                                        </p>
                                    </div>

                                    <ul className="py-2 text-sm font-medium">
                                        <li>
                                            <Link
                                                to="/profile"
                                                onClick={() =>
                                                    setUserOpen(
                                                        false
                                                    )
                                                }
                                                className="flex items-center px-4 py-2 hover:bg-amber-100 dark:hover:bg-slate-700"
                                            >
                                                <UserRound className="w-4 h-4 mr-3" />
                                                Profile
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/settings"
                                                onClick={() =>
                                                    setUserOpen(
                                                        false
                                                    )
                                                }
                                                className="flex items-center px-4 py-2 hover:bg-amber-100 dark:hover:bg-slate-700"
                                            >
                                                <Settings className="w-4 h-4 mr-3" />
                                                System Settings
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/resetpassword"
                                                onClick={() =>
                                                    setUserOpen(
                                                        false
                                                    )
                                                }
                                                className="flex items-center px-4 py-2 hover:bg-amber-100 dark:hover:bg-slate-700"
                                            >
                                                <KeyRound className="w-4 h-4 mr-3" />
                                                Reset Password
                                            </Link>
                                        </li>

                                        <li className="border-t border-amber-200 dark:border-slate-700 mt-1 pt-1">
                                            <button
                                                type="button"
                                                onClick={
                                                    handleLogout
                                                }
                                                className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-slate-700"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen(
                                    (prev) =>
                                        !prev
                                )
                            }
                            className="md:hidden p-1.5 text-gray-600 dark:text-slate-400"
                        >
                            {menuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden md:block bg-amber-100/40 dark:bg-slate-800/40 border-t border-amber-200/50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-8 overflow-x-auto">
                    {navLinks.map(
                        (link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({
                                    isActive,
                                }) =>
                                    `px-1 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${
                                        isActive
                                            ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                                            : "border-transparent text-gray-600 dark:text-slate-400"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        )
                    )}
                </nav>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-amber-50 dark:bg-slate-900 border-t border-amber-200 dark:border-slate-800 absolute w-full left-0 shadow-lg">

                    <div className="px-4 py-4 flex justify-center">
                        {isStationManager ? (
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-100/50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-full text-cyan-700 dark:text-cyan-400 w-full max-w-xs">
                                <MapPin className="w-4 h-4" />
                                {activeStation}
                            </div>
                        ) : (
                            <div className="flex w-full max-w-xs bg-amber-200/50 dark:bg-slate-950 rounded-full p-1">
                                {[
                                    "Maitri",
                                    "Bharati",
                                ].map((station) => (
                                    <button
                                        key={station}
                                        type="button"
                                        onClick={() =>
                                            changeStation(
                                                station
                                            )
                                        }
                                        className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold ${
                                            activeStation ===
                                            station
                                                ? "bg-cyan-500 text-white"
                                                : "text-gray-600 dark:text-slate-400"
                                        }`}
                                    >
                                        {station}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <nav className="flex flex-col px-2 pb-4 space-y-1">
                        {navLinks.map(
                            (link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        `block px-3 py-3 rounded-lg text-base font-semibold ${
                                            isActive
                                                ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                                                : "text-gray-700 dark:text-slate-400"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            )
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}