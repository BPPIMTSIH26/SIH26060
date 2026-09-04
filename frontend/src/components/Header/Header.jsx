/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom"; 
import Logo from '../../../public/Logo';
import { UserRound, Settings, LogOut, KeyRound, Menu, X, MapPin } from 'lucide-react';
import ThemeToggle from "../context/ThemeToggle";
import AlertsDropdown from '../context/Alerts/AlertsDropdown';
import { useToast } from "../context/ToastContext";

// Added Requisitions (Shop) to the navigation bar
const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Infrastructure", to: "/infrastructure" },
  { label: "Environment", to: "/environment" },
  { label: "Energy & Power", to: "/energypower" },
  { label: "Logistics", to: "/logistics" },
  { label: "Requisitions", to: "/requisitions" },
];

export default function Header({ alerts = [], lastUpdate = "Just now", activeStation, setActiveStation }) {
  const [userOpen, setUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 

  const showToast = useToast();

  // 1. Retrieve and parse the user from LocalStorage
  const storedUser = localStorage.getItem("polar_twin_user");
  let user = { fullName: "Unknown Operator", email: "operator@ncpor.gov", role: "operator", avatar: "" };
  
  if (storedUser && storedUser !== "undefined") {
      try {
          const parsedUser = JSON.parse(storedUser);
          user = {
              fullName: parsedUser.fullName || parsedUser.name || "Operator",
              email: parsedUser.email || "operator@ncpor.gov",
              role: parsedUser.role || "operator",
              avatar: parsedUser.avatar || ""
          };
      } catch (error) {
          console.error("Failed to parse user data in header.");
      }
  }

  const isStationMaster = user.role === "station_master";

  // 2. Format the role (e.g., "station_master" -> "Station Master")
  const formatRole = (roleString) => {
      if (!roleString) return "Operator";
      return roleString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // 3. Handle Logout
  const handleLogout = () => {
      setUserOpen(false);
      localStorage.removeItem("polar_twin_user"); 
      
      if (typeof showToast === 'function') {
          showToast("Session securely terminated. Safe travels.", "info");
      }
      navigate("/auth", { replace: true }); 
  };

  const avatarUrl = user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0f172a&color=06b6d4&bold=true`;

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

  const renderStationButton = (station) => (
    <button 
      key={station}
      onClick={() => { setActiveStation(station); setMenuOpen(false); }}
      className={`px-5 sm:py-1.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex-1 sm:flex-none ${
        activeStation === station 
          ? "bg-cyan-500 text-white dark:text-slate-900 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
      }`}
    >
      {station}
    </button>
  );

  return (
    <header className="bg-amber-50 dark:bg-slate-900 border-b border-amber-200/60 dark:border-slate-700 font-sans z-50 sticky top-0 transition-colors duration-200">
      
      {/* TOP ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* LEFT: Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Logo/>
          </div>

          {/* CENTER: Station Toggle / Locked Station Badge */}
          <div className="hidden sm:flex justify-center shrink-0">
            {isStationMaster ? (
              // LOCKED BADGE FOR STATION MASTER
              <div className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-100/50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-full text-cyan-700 dark:text-cyan-400 text-sm font-bold tracking-wider uppercase cursor-not-allowed">
                <MapPin className="w-4 h-4" />
                {activeStation}
              </div>
            ) : (
              // FULL TOGGLE FOR LOGISTICS & AUTHORITY
              <div className="flex items-center bg-amber-200/40 dark:bg-slate-950 rounded-full p-1 border border-amber-300/50 dark:border-slate-700 shadow-inner transition-colors">
                {["Maitri", "Bharati"].map(renderStationButton)}
              </div>
            )}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex-1 flex items-center justify-end space-x-3 sm:space-x-4">
            
            <ThemeToggle />
            <AlertsDropdown alerts={alerts} activeStation={activeStation} />

            {/* DYNAMIC USER TEXT */}
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">
                  {user.fullName}
              </div>
              <div className="text-xs text-cyan-600 dark:text-cyan-500 font-medium">
                  {formatRole(user.role)}
              </div>
            </div>

            {/* User Dropdown Wrapper */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setUserOpen(!userOpen)}
                className="h-10 w-10 rounded-full bg-amber-100 dark:bg-slate-700 flex items-center justify-center border-2 border-amber-300/80 dark:border-slate-500 overflow-hidden shadow-md shrink-0 transition-colors cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-900"
                aria-expanded={userOpen}
              >
                <img
                  src={avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-12 mt-2 w-56 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 transition-colors">
                  
                  {/* DYNAMIC DROPDOWN HEADER */}
                  <div className="px-4 py-3 border-b border-amber-200/60 dark:border-slate-700 bg-amber-100/50 dark:bg-slate-900/50">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.fullName}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                  
                  <ul className="text-sm font-medium text-gray-700 dark:text-slate-300 py-2">
                    <li>
                      <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center px-4 py-2 hover:bg-amber-100/80 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        <UserRound className="w-4 h-4 mr-3" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={() => setUserOpen(false)} className="flex items-center px-4 py-2 hover:bg-amber-100/80 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        <Settings className="w-4 h-4 mr-3" /> System Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/resetpassword" onClick={() => setUserOpen(false)} className="flex items-center px-4 py-2 hover:bg-amber-100/80 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        <KeyRound className="w-4 h-4 mr-3" /> Reset Password
                      </Link>
                    </li>
                    <div className="h-[1px] bg-amber-200/60 dark:bg-slate-700 my-1 transition-colors"></div>
                    
                    {/* LOGOUT BUTTON */}
                    <li>
                      <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100/60 dark:hover:bg-slate-700 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-amber-100/80 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block bg-amber-100/40 dark:bg-slate-800/40 border-t border-amber-200/50 dark:border-transparent transition-colors">
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
                      : "border-transparent text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:border-amber-300 dark:hover:border-slate-500"
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
        <div className="md:hidden bg-amber-50 dark:bg-slate-900 border-t border-amber-200/60 dark:border-slate-800 absolute w-full left-0 shadow-lg transition-colors z-40">
          
          <div className="sm:hidden px-4 py-4 flex justify-center bg-amber-100/40 dark:bg-slate-950/50 border-b border-amber-200/60 dark:border-slate-800 transition-colors">
            {isStationMaster ? (
              // LOCKED BADGE FOR STATION MASTER (MOBILE)
              <div className="flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-100/50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-full text-cyan-700 dark:text-cyan-400 text-sm font-bold tracking-wider uppercase w-full max-w-xs">
                <MapPin className="w-4 h-4" />
                {activeStation}
              </div>
            ) : (
              // FULL TOGGLE FOR LOGISTICS & AUTHORITY (MOBILE)
              <div className="flex items-center bg-amber-200/50 dark:bg-slate-950 rounded-full p-1 border border-amber-300/60 dark:border-slate-700 w-full max-w-xs transition-colors">
                {["Maitri", "Bharati"].map(renderStationButton)}
              </div>
            )}
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
                      : "text-gray-700 dark:text-slate-400 hover:bg-amber-100/80 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
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