import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from "react-router-dom";
import Logo from '../../../public/Logo';
import { UserRound, Settings, LogOut, KeyRound, Menu, X } from 'lucide-react';
import ThemeToggle from "../Others/ThemeToggle";

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Infrastructure", to: "/infrastructure" },
  { label: "Energy & Power", to: "/energypower" },
  { label: "Logistics", to: "/logistics" },
  { label: "Environment", to: "/environment" },
];

export default function Header() {
  const [activeStation, setActiveStation] = useState("Maitri");
  const [userOpen, setUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    };

    if (userOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userOpen]);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 font-sans z-50 sticky top-0 transition-colors duration-200">
      
      {/* TOP ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo & Branding */}
          <Logo/>

          {/* Center: Station Toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-slate-950 rounded-full p-1 border border-gray-200 dark:border-slate-700 shadow-inner absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 transition-colors">
            <button 
              onClick={() => setActiveStation("Maitri")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeStation === "Maitri" 
                  ? "bg-cyan-500 text-white dark:text-slate-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Maitri
            </button>
            <button 
              onClick={() => setActiveStation("Bharati")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeStation === "Bharati" 
                  ? "bg-cyan-500 text-white dark:text-slate-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Bharati
            </button>
          </div>

          {/* Right: Theme Toggle, User Profile & Hamburger */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            <ThemeToggle />

            {/* Static Text - Moved OUTSIDE the relative dropdown wrapper */}
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">Sayantan Pachal</div>
              <div className="text-xs text-cyan-600 dark:text-cyan-500 font-medium">Lead Operator</div>
            </div>

            {/* User Dropdown Wrapper - Anchored strictly to the 40px Avatar */}
            <div className="relative" ref={dropdownRef}>
              
              {/* Clickable Avatar Button */}
              <button 
                onClick={() => setUserOpen(!userOpen)}
                className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center border-2 border-gray-300 dark:border-slate-500 overflow-hidden shadow-md shrink-0 transition-colors cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-900"
                aria-expanded={userOpen}
                aria-label="Toggle user menu"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=Sayantan+Pachal&background=0f172a&color=06b6d4&bold=true`}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* User Dropdown Menu */}
              {userOpen && (
                <div className="absolute right-0 top-12 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 transition-colors">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Sayantan Pachal</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 truncate">sayantan@moes.gov.in</p>
                  </div>
                  <ul className="text-sm font-medium text-gray-700 dark:text-slate-300 py-2">
                    <li>
                      <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        <UserRound className="w-4 h-4 mr-3" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={() => setUserOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        <Settings className="w-4 h-4 mr-3" /> System Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/reset-password" onClick={() => setUserOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        <KeyRound className="w-4 h-4 mr-3" /> Reset Password
                      </Link>
                    </li>
                    <div className="h-[1px] bg-gray-100 dark:bg-slate-700 my-1 transition-colors"></div>
                    <li>
                      <button onClick={() => setUserOpen(false)} className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block bg-gray-50 dark:bg-slate-800/40 border-t border-gray-100 dark:border-transparent transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-8 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-1 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                      : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-500"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 absolute w-full left-0 shadow-lg transition-colors z-40">
          
          <div className="sm:hidden px-4 py-4 flex justify-center bg-gray-50 dark:bg-slate-950/50 border-b border-gray-200 dark:border-slate-800 transition-colors">
             <div className="flex items-center bg-gray-200 dark:bg-slate-950 rounded-full p-1 border border-gray-300 dark:border-slate-700 w-full max-w-xs transition-colors">
              <button 
                onClick={() => { setActiveStation("Maitri"); setMenuOpen(false); }}
                className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeStation === "Maitri" 
                    ? "bg-cyan-500 text-white dark:text-slate-900" 
                    : "text-gray-600 dark:text-slate-400"
                }`}
              >
                Maitri
              </button>
              <button 
                onClick={() => { setActiveStation("Bharati"); setMenuOpen(false); }}
                className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeStation === "Bharati" 
                    ? "bg-cyan-500 text-white dark:text-slate-900" 
                    : "text-gray-600 dark:text-slate-400"
                }`}
              >
                Bharati
              </button>
            </div>
          </div>

          <nav className="flex flex-col px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                      : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

    </header>
  );
}