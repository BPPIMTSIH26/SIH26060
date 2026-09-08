import {
    useEffect,
    useState,
} from "react";

import {
    Moon,
    Sun,
} from "lucide-react";

const getInitialTheme = () => {
    const savedTheme =
        localStorage.getItem(
            "theme"
        );

    if (
        savedTheme === "dark" ||
        savedTheme === "light"
    ) {
        return savedTheme;
    }

    if (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
    ) {
        return "dark";
    }

    return "light";
};

export default function ThemeToggle() {
    const [theme, setTheme] =
        useState(getInitialTheme);

    useEffect(() => {
        const root =
            document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove(
                "dark"
            );
        }

        localStorage.setItem(
            "theme",
            theme
        );
    }, [theme]);

    const toggleTheme = () => {
        setTheme(
            (previous) =>
                previous === "dark"
                    ? "light"
                    : "dark"
        );
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            aria-pressed={
                theme === "dark"
            }
            className="rounded-full shadow-md transition-colors duration-300 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-1.5 lg:px-2 py-1.5 lg:py-2 mr-2.5 lg:mr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
            {theme === "dark" ? (
                <Sun
                    className="w-5 h-5 text-yellow-400"
                    strokeWidth={2}
                />
            ) : (
                <Moon
                    className="w-5 h-5 text-gray-600"
                    strokeWidth={2}
                />
            )}
        </button>
    );
}