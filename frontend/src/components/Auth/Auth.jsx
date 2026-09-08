import { useEffect, useState } from "react";
import Login from "./login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";

const AUTH_MODES = {
    LOGIN: "login",
    SIGNUP: "signup",
    FORGOT: "forgot",
};

export default function Auth() {
    const getInitialMode = () => {
        const hash = window.location.hash
            .replace("#", "")
            .toLowerCase();

        if (hash === "signup") {
            return AUTH_MODES.SIGNUP;
        }

        if (hash === "forgot") {
            return AUTH_MODES.FORGOT;
        }

        return AUTH_MODES.LOGIN;
    };

    const [mode, setMode] = useState(
        getInitialMode
    );

    const changeMode = (nextMode) => {
        setMode(nextMode);

        if (nextMode === AUTH_MODES.LOGIN) {
            window.history.replaceState(
                null,
                "",
                "/auth#login"
            );
        } else if (
            nextMode === AUTH_MODES.SIGNUP
        ) {
            window.history.replaceState(
                null,
                "",
                "/auth#signup"
            );
        } else if (
            nextMode === AUTH_MODES.FORGOT
        ) {
            window.history.replaceState(
                null,
                "",
                "/auth#forgot"
            );
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash
                .replace("#", "")
                .toLowerCase();

            if (hash === "signup") {
                setMode(AUTH_MODES.SIGNUP);
            } else if (hash === "forgot") {
                setMode(AUTH_MODES.FORGOT);
            } else {
                setMode(AUTH_MODES.LOGIN);
            }
        };

        window.addEventListener(
            "hashchange",
            handleHashChange
        );

        handleHashChange();

        return () => {
            window.removeEventListener(
                "hashchange",
                handleHashChange
            );
        };
    }, []);

    return (
        <div className="dark min-h-screen w-full bg-[#020817] text-white transition-colors duration-300">
            <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-md">
                    <div className="w-full rounded-3xl border border-slate-700/80 bg-[#0b1326] shadow-2xl overflow-hidden">
                        <div className="px-5 py-7 sm:px-8 sm:py-8">
                            {mode === AUTH_MODES.LOGIN && (
                                <Login
                                    onSwitchMode={() =>
                                        changeMode(
                                            AUTH_MODES.SIGNUP
                                        )
                                    }
                                    onForgotClick={() =>
                                        changeMode(
                                            AUTH_MODES.FORGOT
                                        )
                                    }
                                />
                            )}

                            {mode === AUTH_MODES.SIGNUP && (
                                <Signup
                                    onSwitchMode={() =>
                                        changeMode(
                                            AUTH_MODES.LOGIN
                                        )
                                    }
                                />
                            )}

                            {mode === AUTH_MODES.FORGOT && (
                                <ForgotPassword
                                    onBackToLogin={() =>
                                        changeMode(
                                            AUTH_MODES.LOGIN
                                        )
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}