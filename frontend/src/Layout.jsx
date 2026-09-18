import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import { GlobalAlertProvider } from './components/context/Alerts/GlobalAlertContext'; 
import GlobalBanner from './components/context/Alerts/GlobalBanner'; 
import ScrollToTop from './components/context/ScrollToTop';
import { useToast } from './components/context/ToastContext';
import { validateSession } from './services/config';

export default function Layout() {
    const [activeStation, setActiveStation] = useState("Maitri");
    
    // Hooks for session validation
    const navigate = useNavigate();
    const showToast = useToast();

    // =========================================================================
    // STRICT CALENDAR-DAY SESSION VALIDATION
    // =========================================================================
    useEffect(() => {
        validateSession(showToast, () => navigate('/login'));
        
        const interval = setInterval(() => {
            validateSession(showToast, () => navigate('/login'));
        }, 60000); 

        return () => clearInterval(interval);
    }, [navigate, showToast]);

    return (
        <div className="flex flex-col min-h-screen bg-amber-50 dark:bg-slate-950 transition-colors duration-300">
            <GlobalAlertProvider activeStation={activeStation}>
                
                <Header 
                    activeStation={activeStation} 
                    setActiveStation={setActiveStation} 
                />
                
                {/* 
                    The banner slots in right here! 
                    It is in the normal document flow, so when it appears, 
                    it stretches the gap and pushes <main> downwards automatically.
                */}
                <GlobalBanner />
                <ScrollToTop />
                
                <main className="grow">
                    <Outlet context={{ activeStation }} />
                </main>
                
                <Footer />
                
            </GlobalAlertProvider>
        </div>
    );
}