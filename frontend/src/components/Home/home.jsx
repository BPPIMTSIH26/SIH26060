
import React from "react";
import { Link } from "react-router-dom";
import {
    Database,
    Network,
    Zap,
    Snowflake,
    ShieldAlert,
    ArrowRight,
    Lock,
    Code2,
    Server,
} from "lucide-react";

import Logo from "../../../public/Logo";
import ThemeToggle from "../context/ThemeToggle";

/* ============================================================
   PUBLIC HEADER
   ============================================================ */

function PublicHeader() {
    return (
        <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Logo />

                        <span className="text-slate-900 dark:text-white font-bold text-lg tracking-wide hidden sm:block">
                            POLAR TWIN
                        </span>
                    </div>

                    {/* Navigation + Theme + Login */}
                    <div className="flex items-center gap-6">

                        <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <a
                                href="#engine"
                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            >
                                Simulation Engine
                            </a>

                            <a
                                href="#architecture"
                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            >
                                Architecture
                            </a>

                            <a
                                href="#modules"
                                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            >
                                Subsystems
                            </a>
                        </nav>

                        <ThemeToggle />

                        <Link
                            to="/auth"
                            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(8,145,178,0.2)] dark:shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                        >
                            <Lock className="w-4 h-4" />
                            System Login
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

/* ============================================================
   PUBLIC FOOTER
   ============================================================ */

function PublicFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-100 dark:bg-slate-950 border-t-4 border-orange-500 font-sans pt-12 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">

                <p className="text-sm font-medium mb-2">
                    Project Showcase:{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                        Polar Twin Systems & Data Group
                    </strong>
                </p>

                <p className="text-xs mb-6 max-w-2xl mx-auto leading-relaxed">
                    A full-stack software simulation platform modeling
                    interdependent telemetry, infrastructure,
                    energy, environmental conditions, and supply
                    chain workflows for polar research stations.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500 pt-6 border-t border-slate-200 dark:border-slate-800">

                    <span>
                        &copy; {currentYear} Polar Twin Architecture
                    </span>

                    <span className="hidden sm:inline">
                        |
                    </span>

                    <span className="font-mono text-cyan-600 dark:text-cyan-500">
                        SYS_V1.0.0
                    </span>
                </div>
            </div>
        </footer>
    );
}

/* ============================================================
   MAIN LANDING PAGE
   ============================================================ */

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-300">

            <PublicHeader />

            <main>

                {/* ========================================================
                    HERO SECTION
                   ======================================================== */}

                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">

                    {/* Architectural Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />

                    {/* Cyan Glow */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                        {/* Architecture Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-8 shadow-sm">
                            <Code2 className="w-3.5 h-3.5" />
                            Full-Stack Architecture
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">

                            Digital Twin
                            <br className="hidden sm:block" />

                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                                Simulation Engine
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Polar Twin is a full-stack software platform
                            designed to simulate station telemetry,
                            interdependent subsystem behavior,
                            role-based operational workflows,
                            and supply-chain activity for
                            extreme-environment research stations.
                        </p>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">

                            <Link
                                to="/auth"
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-800 dark:hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                Access Simulation
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <a
                                href="#engine"
                                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center shadow-sm"
                            >
                                View Architecture
                            </a>

                        </div>
                    </div>
                </section>

                {/* ========================================================
                    SOFTWARE ENGINE
                   ======================================================== */}

                <section
                    id="engine"
                    className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800/50 transition-colors duration-300"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        <div className="mb-16 md:flex md:justify-between md:items-end">

                            <div className="max-w-2xl">

                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                    Behind the Simulation
                                </h2>

                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Polar Twin provides a software layer
                                    that models station infrastructure,
                                    energy systems, environmental
                                    telemetry, logistics, and operational
                                    state transitions. The platform
                                    exchanges structured JSON data between
                                    frontend components and backend APIs
                                    to reproduce a continuously changing
                                    station environment.
                                </p>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {[
                                {
                                    icon: Server,
                                    title: "Data Simulation Layer",
                                    desc: "A structured telemetry and backend data layer generates station data such as environmental conditions, generator output, battery state, inventory, personnel, and logistics activity.",
                                },
                                {
                                    icon: Network,
                                    title: "Interdependent Logic",
                                    desc: "Subsystems are connected through application logic. Changes in energy, infrastructure, environment, or logistics can affect the station health model and generate corresponding operational alerts.",
                                },
                                {
                                    icon: ShieldAlert,
                                    title: "Authentication & RBAC",
                                    desc: "JWT-protected APIs enforce role-based access. Station Managers operate their assigned station, while Logistics Managers and NCPOR Operators receive broader operational access.",
                                },
                            ].map((item, idx) => {

                                const Icon = item.icon;

                                return (
                                    <div
                                        key={idx}
                                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 dark:hover:border-cyan-500/30 transition-colors shadow-sm"
                                    >

                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                            <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {item.desc}
                                        </p>

                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </section>

                {/* ========================================================
                    ARCHITECTURE
                   ======================================================== */}

                <section
                    id="architecture"
                    className="py-24"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                            {/* LEFT CONTENT */}

                            <div>

                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                                    Built for Scale and Reliability
                                </h2>

                                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                    The platform is structured around
                                    authenticated APIs, modular React
                                    components, centralized application
                                    context, and backend role
                                    authorization. Operational events can
                                    propagate across modules while station
                                    access remains constrained according
                                    to the authenticated user role.
                                </p>

                                <ul className="space-y-4">

                                    {[
                                        "JWT-protected API routes with role-based authorization",
                                        "Station-scoped access for Station Managers",
                                        "Centralized event and alert propagation",
                                        "Structured telemetry and logistics APIs",
                                        "Responsive React architecture with reusable components",
                                        "Persistent user session metadata for frontend state",
                                    ].map(
                                        (feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300"
                                            >

                                                <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">

                                                    <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400" />

                                                </div>

                                                {feature}

                                            </li>
                                        )
                                    )}

                                </ul>
                            </div>

                            {/* ARCHITECTURE PLACEHOLDER */}

                            <div className="relative group">

                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />

                                <div className="relative w-full aspect-video bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-lg">

                                    <Database className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />

                                    <p className="text-slate-500 font-mono text-sm font-bold uppercase tracking-widest">
                                        Architecture Diagram
                                    </p>

                                    <p className="text-slate-400 dark:text-slate-600 text-xs mt-2 text-center px-6">
                                        Frontend → API Layer → Controllers → MongoDB
                                    </p>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    MODULE PREVIEW
                   ======================================================== */}

                <section
                    id="modules"
                    className="py-20 bg-white dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800/30 transition-colors duration-300"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">
                            Simulated Modules
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            {[
                                {
                                    name: "Supply Chain",
                                    icon: Network,
                                    color: "text-blue-600 dark:text-blue-400",
                                    bg: "bg-blue-100 dark:bg-blue-900/20",
                                },
                                {
                                    name: "Environment",
                                    icon: Snowflake,
                                    color: "text-cyan-600 dark:text-cyan-400",
                                    bg: "bg-cyan-100 dark:bg-cyan-900/20",
                                },
                                {
                                    name: "Power Grid",
                                    icon: Zap,
                                    color: "text-amber-600 dark:text-amber-400",
                                    bg: "bg-amber-100 dark:bg-amber-900/20",
                                },
                                {
                                    name: "Infrastructure",
                                    icon: ShieldAlert,
                                    color: "text-red-600 dark:text-red-400",
                                    bg: "bg-red-100 dark:bg-red-900/20",
                                },
                            ].map((mod, i) => {

                                const Icon = mod.icon;

                                return (
                                    <div
                                        key={i}
                                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
                                    >

                                        <div
                                            className={`p-4 rounded-full ${mod.bg}`}
                                        >
                                            <Icon
                                                className={`w-8 h-8 ${mod.color}`}
                                            />
                                        </div>

                                        <span className="font-bold text-slate-700 dark:text-slate-200">
                                            {mod.name}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </section>

            </main>

            <PublicFooter />

        </div>
    );
}

