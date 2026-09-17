/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // NEW: Imported hooks for URL tracking
import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./ForgotPassword";
import Logo from "../../../public/Logo"; // Adjust path to your logo
import ThemeToggle from "../context/ThemeToggle";

export default function Auth() {
    const location = useLocation();
    const navigate = useNavigate();

    // NEW: Determine initial mode based on the URL hash when the component first loads
    const getInitialMode = () => {
        const hash = location.hash.replace('#', '');
        if (hash === 'signup') return 'signup';
        if (hash === 'forgot') return 'forgot';
        return 'login'; // default
    };

    const [authMode, setAuthMode] = useState(getInitialMode()); 

    // NEW: Listen for URL hash changes (e.g., if the user uses the browser Back/Forward buttons)
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash === 'signup') setAuthMode('signup');
        else if (hash === 'forgot') setAuthMode('forgot');
        else setAuthMode('login');
    }, [location.hash]);

    const handleSwitchMode = (mode) => {
        setAuthMode(mode);
        // NEW: Silently update the URL hash so it matches the current view
        navigate(`/auth#${mode}`, { replace: true });
    };

    const isRightPanelActive = authMode === 'login' || authMode === 'forgot';

    return (
        <div className="relative min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-amber-50 dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            
            {/* Theme Toggle pinned to top right */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[100]">
                <ThemeToggle />
            </div>

            <div className="relative w-full max-w-5xl h-auto md:h-[600px] max-h-[95dvh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
                
                {/* LEFT SIDE: SIGNUP FORM */}
                <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full z-10 items-center justify-center p-8 transition-all duration-[800ms] ease-in-out ${
                    !isRightPanelActive ? 'opacity-100 brightness-100 scale-100 delay-100' : 'opacity-0 brightness-50 scale-95 pointer-events-none'
                }`}>
                    {!isRightPanelActive && (
                        <Signup onSwitchMode={() => handleSwitchMode('login')} />
                    )}
                </div>

                {/* RIGHT SIDE: LOGIN OR FORGOT PASSWORD */}
                <div className={`hidden md:flex absolute top-0 right-0 w-1/2 h-full z-10 items-center justify-center p-8 transition-all duration-[800ms] ease-in-out ${
                    isRightPanelActive ? 'opacity-100 brightness-100 scale-100 delay-100' : 'opacity-0 brightness-50 scale-95 pointer-events-none'
                }`}>
                    {authMode === 'login' && (
                        <Login onSwitchMode={() => handleSwitchMode('signup')} onForgotClick={() => handleSwitchMode('forgot')} />
                    )}
                    {authMode === 'forgot' && (
                        <ForgotPassword onBackToLogin={() => handleSwitchMode('login')} />
                    )}
                </div>

                {/* DESKTOP VIEW: SLIDING IMAGE PANEL */}
                {/* Updated to transition beautifully between light and dark themes */}
                <div className={`hidden md:flex flex-col justify-between absolute top-0 left-0 w-1/2 h-full z-30 transition-transform duration-1800ms cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-black overflow-hidden ${
                    isRightPanelActive ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    
                    {/* Subtle watermark background: uses multiply in light mode, screen in dark mode */}
                    <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('/image_2364ec.png')] bg-cover bg-center mix-blend-multiply dark:mix-blend-screen"></div>
                    
                    <div className="w-full flex justify-center pt-10 relative z-10">
                        <Logo />
                    </div>

                    <div className="w-full flex-1 flex flex-col items-center justify-center pb-12 px-8 relative z-20 text-center">
                        <img 
                            src="/image.png" 
                            alt="Antarctic Station Command"
                            className="w-56 h-56 object-contain mb-8 animate-in fade-in zoom-in duration-700 drop-shadow-md dark:drop-shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                        />
                        {/* Text colors updated to support both light and dark mode */}
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                            {isRightPanelActive ? "Antarctic Command" : "Request Clearance"}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-xs transition-colors duration-300">
                            {isRightPanelActive 
                                ? "Secure access to the NCPOR Polar Twin infrastructure. Monitor telemetry and manage logistics."
                                : "Join the Polar Twin network. All access requests are logged and monitored by station authority."
                            }
                        </p>
                    </div>
                </div>

                {/* MOBILE VIEW: Responsive Stack */}
                <div className="md:hidden w-full h-full relative z-20 flex flex-col items-center justify-center p-5 sm:p-8 overflow-y-auto scrollbar-hide bg-white dark:bg-slate-900">
                    <div className="w-full flex justify-center py-4 mb-4">
                        <Logo />
                    </div>
                    <div className="w-full flex justify-center">
                        {authMode === 'login' && (
                            <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
                                <Login onSwitchMode={() => handleSwitchMode('signup')} onForgotClick={() => handleSwitchMode('forgot')} />
                            </div>
                        )}
                        {authMode === 'signup' && (
                            <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
                                <Signup onSwitchMode={() => handleSwitchMode('login')} />
                            </div>
                        )}
                        {authMode === 'forgot' && (
                            <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
                                <ForgotPassword onBackToLogin={() => handleSwitchMode('login')} />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}