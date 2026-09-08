import React from "react";
import ReactDOM from "react-dom/client";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import "./index.css";

import Home from "./components/Home/home";
import Auth from "./components/Auth/Auth";
import VerifyOtp from "./components/Auth/VerifyOtp";

import Layout from "./Layout";

import ProtectedRoute from "./components/context/ProtectedRoute";
import PublicRoute from "./components/context/PublicRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import Infrastructure from "./pages/Infrastructure/Infrastructure";
import Environment from "./pages/Environment/Environment";
import EnergyPower from "./pages/EnergyPower/EnergyPower";
import Logistics from "./pages/Logistics/Logistics";
import Requisitions from "./pages/Requisition/Requisitions";

import { ToastProvider } from "./components/context/ToastContext";
import { GlobalAlertProvider } from "./components/context/Alerts/GlobalAlertContext";

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <GlobalAlertProvider>
                    <Routes>

                        {/* =====================================================
                            PUBLIC HOME
                           ===================================================== */}
                        <Route
                            path="/"
                            element={
                                <PublicRoute>
                                    <Home />
                                </PublicRoute>
                            }
                        />

                        {/* =====================================================
                            AUTH
                           ===================================================== */}
                        <Route
                            path="/auth"
                            element={
                                <PublicRoute>
                                    <Auth />
                                </PublicRoute>
                            }
                        />

                        {/* Compatibility route */}
                        <Route
                            path="/login"
                            element={
                                <Navigate
                                    to="/auth"
                                    replace
                                />
                            }
                        />

                        {/* Compatibility route */}
                        <Route
                            path="/signup"
                            element={
                                <Navigate
                                    to="/auth"
                                    replace
                                />
                            }
                        />

                        {/* =====================================================
                            OTP VERIFICATION

                            IMPORTANT:
                            This route MUST remain public because the user
                            does not have an access token yet.
                           ===================================================== */}
                        <Route
                            path="/verify-otp"
                            element={<VerifyOtp />}
                        />

                        {/* =====================================================
                            PROTECTED APPLICATION ROUTES
                           ===================================================== */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/infrastructure"
                                element={<Infrastructure />}
                            />

                            <Route
                                path="/environment"
                                element={<Environment />}
                            />

                            <Route
                                path="/energypower"
                                element={<EnergyPower />}
                            />

                            <Route
                                path="/logistics"
                                element={<Logistics />}
                            />

                            <Route
                                path="/requisitions"
                                element={<Requisitions />}
                            />
                        </Route>

                        {/* =====================================================
                            CATCH-ALL
                           ===================================================== */}
                        <Route
                            path="*"
                            element={
                                <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-slate-950">
                                    <div className="text-center">
                                        <h1 className="text-6xl font-bold text-slate-900 dark:text-white">
                                            404
                                        </h1>

                                        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                                            Page not found
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                window.location.href =
                                                    "/auth";
                                            }}
                                            className="mt-6 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                                        >
                                            Return to Login
                                        </button>
                                    </div>
                                </div>
                            }
                        />

                    </Routes>
                </GlobalAlertProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);