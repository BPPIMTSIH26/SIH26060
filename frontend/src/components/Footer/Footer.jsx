import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-200 py-3 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 dark:text-slate-500 font-medium tracking-wide">
          
          {/* Left: Classification & Ministry */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <span className="font-bold text-gray-700 dark:text-slate-400 border border-gray-300 dark:border-slate-700 px-1.5 py-0.5 rounded-sm">
              RESTRICTED
            </span>
            <span className="hidden sm:inline">|</span>
            <span>Ministry of Earth Sciences, Govt. of India</span>
          </div>

          {/* Right: Copyright & Version */}
          <div className="flex items-center space-x-3">
            <span>&copy; {currentYear} NCPOR</span>
            <span>&bull;</span>
            <span className="font-mono">Sys_v1.0.0</span>
          </div>

        </div>
        
      </div>
    </footer>
  );
}