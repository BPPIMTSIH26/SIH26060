
import React from "react";
import { Link } from "react-router-dom";
import { MapPinOff, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-amber-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 font-sans transition-colors duration-300">
            
            <div className="w-full max-w-lg text-center">

                {/* ========================================================
                    ICON
                   ======================================================== */}

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
                    <MapPinOff className="h-10 w-10 text-cyan-600 dark:text-cyan-400" />
                </div>

                {/* ========================================================
                    404
                   ======================================================== */}

                <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
                    Navigation Error
                </p>

                <h1 className="mb-2 text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
                    404
                </h1>

                {/* ========================================================
                    TITLE
                   ======================================================== */}

                <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-200 sm:text-2xl">
                    Uncharted Coordinates
                </h2>

                {/* ========================================================
                    DESCRIPTION
                   ======================================================== */}

                <p className="mx-auto mb-8 max-w-md text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    The requested route does not correspond to a known
                    sector within the Polar Twin network. The destination
                    may have been moved, decommissioned, or may not exist.
                </p>

                {/* ========================================================
                    SYSTEM STATUS
                   ======================================================== */}

                <div className="mx-auto mb-8 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50">

                    <div className="mb-3 flex items-center justify-between">

                        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Navigation Status
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Route Not Found
                        </span>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/50">

                            <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Station Grid
                            </p>

                            <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                                ACTIVE
                            </p>

                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/50">

                            <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Network
                            </p>

                            <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                NOMINAL
                            </p>

                        </div>

                    </div>
                </div>

                {/* ========================================================
                    RETURN ACTION
                   ======================================================== */}

                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-cyan-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 dark:focus:ring-offset-slate-950"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Return to Polar Twin
                </Link>

                {/* ========================================================
                    FOOTER IDENTIFIER
                   ======================================================== */}

                <p className="mt-6 font-mono text-[0.6rem] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                    POLAR_TWIN · NAV_404
                </p>

            </div>
        </div>
    );
}
