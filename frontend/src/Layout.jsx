import { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

import { GlobalAlertProvider } from './components/context/Alerts/GlobalAlertContext'; 
import GlobalBanner from './components/context/Alerts/GlobalBanner'; 
import ScrollToTop from './components/context/ScrollToTop';

export default function Layout() {
    const [activeStation, setActiveStation] = useState("Maitri");

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