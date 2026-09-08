/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from "react";

import {
    CheckCircle2,
    XCircle,
    Info,
} from "lucide-react";

const ToastContext =
    createContext(null);

/* ============================================================
   TOAST PROVIDER
   ============================================================ */

export const ToastProvider = ({
    children,
}) => {
    const [toast, setToast] =
        useState({
            message: "",
            type: null,
            visible: false,
        });

    const timerRef =
        useRef(null);

    /* ========================================================
       CLEANUP
       ======================================================== */

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(
                    timerRef.current
                );
            }
        };
    }, []);

    /* ========================================================
       SHOW TOAST
       ======================================================== */

    const showToast =
        useCallback(
            (
                message,
                type = "info"
            ) => {
                if (
                    message ===
                        undefined ||
                    message === null
                ) {
                    return;
                }

                if (timerRef.current) {
                    clearTimeout(
                        timerRef.current
                    );
                }

                setToast({
                    message: String(
                        message
                    ),
                    type,
                    visible: true,
                });

                timerRef.current =
                    setTimeout(
                        () => {
                            setToast(
                                (
                                    previous
                                ) => ({
                                    ...previous,
                                    visible:
                                        false,
                                })
                            );
                        },
                        4000
                    );
            },
            []
        );

    /* ========================================================
       STYLES
       ======================================================== */

    const getToastStyles =
        (type) => {
            switch (type) {
                case "success":
                    return "border-emerald-500/40 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.15)]";

                case "error":
                    return "border-red-500/40 bg-red-50/95 dark:bg-red-950/90 text-red-900 dark:text-red-100 shadow-[0_4px_20px_rgba(239,68,68,0.15)]";

                case "warning":
                    return "border-amber-500/40 bg-amber-50/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.15)]";

                default:
                    return "border-cyan-500/40 bg-white/95 dark:bg-slate-900/90 text-cyan-900 dark:text-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.15)]";
            }
        };

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return (
                    <CheckCircle2
                        className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                );

            case "error":
                return (
                    <XCircle
                        className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0"
                    />
                );

            case "warning":
                return (
                    <Info
                        className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0"
                    />
                );

            default:
                return (
                    <Info
                        className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0"
                    />
                );
        }
    };

    /* ========================================================
       RENDER
       ======================================================== */

    return (
        <ToastContext.Provider
            value={showToast}
        >
            {children}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes toast-slide-up {
                            0% {
                                opacity: 0;
                                transform: translateY(20px);
                            }

                            100% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        .animate-toast-slide-up {
                            animation:
                                toast-slide-up
                                0.4s
                                cubic-bezier(0.16, 1, 0.3, 1)
                                forwards;
                        }
                    `,
                }}
            />

            {toast.visible && (
                <div
                    className="
                        fixed
                        z-[9999]
                        pointer-events-none

                        bottom-16
                        left-1/2
                        -translate-x-1/2
                        w-[calc(100vw-2rem)]

                        sm:bottom-8
                        sm:right-8
                        sm:left-auto
                        sm:translate-x-0
                        sm:w-auto
                        sm:min-w-[320px]
                        sm:max-w-md
                    "
                    role="status"
                    aria-live="polite"
                >
                    <div
                        className={`
                            pointer-events-auto
                            backdrop-blur-md
                            border
                            rounded-xl
                            px-4
                            py-3
                            sm:px-5
                            sm:py-3.5
                            flex
                            items-center
                            gap-3
                            w-full
                            shadow-xl
                            animate-toast-slide-up
                            ${getToastStyles(
                                toast.type
                            )}
                        `}
                    >
                        {getIcon(
                            toast.type
                        )}

                        <span className="font-sans text-sm sm:text-[0.9rem] font-semibold tracking-normal leading-tight">
                            {toast.message}
                        </span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

/* ============================================================
   HOOK
   ============================================================ */

export const useToast = () => {
    const context =
        useContext(
            ToastContext
        );

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
};