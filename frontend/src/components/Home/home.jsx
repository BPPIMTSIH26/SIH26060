import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Cpu, 
  Network, 
  Zap, 
  Snowflake, 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  Activity,
  MapPin,
  ExternalLink,
  Shield,
  TrendingUp,
  Gauge,
  Menu,
  X
} from 'lucide-react';
import Logo from '../../../public/Logo';
import ThemeToggle from '../context/ThemeToggle';
import AntarcticMap from '../../components/Others/AntarcticMap'; 

const stationData = [
  {
    id: 'maitri',
    name: 'Maitri Station',
    coordinates: '70°46′00″S 11°43′55″E',
    established: '1989',
    description: "India's second permanent research station in Antarctica, built in 1989. Situated on the rocky mountainous region called Schirmacher Oasis. It serves as a gateway for deep-field scientific expeditions.",
    image: '/maitri.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Maitri_(research_station)',
    theme: {
      hover: 'hover:border-cyan-500/50 dark:hover:border-cyan-500/50',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400',
      link: 'text-cyan-600 dark:text-cyan-400 hover:text-cyan-700',
    }
  },
  {
    id: 'bharati',
    name: 'Bharati Station',
    coordinates: '69°24′29″S 76°11′14″E',
    established: '2012',
    description: "Commissioned in 2012, Bharati is India's newest, state-of-the-art research facility located in the Larsemann Hills. Designed to withstand extreme weather while minimizing environmental footprint.",
    image: '/bharati.jpg',
    wikiLink: 'https://en.wikipedia.org/wiki/Bharati_(research_station)',
    theme: {
      hover: 'hover:border-blue-500/50 dark:hover:border-blue-500/50',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
      link: 'text-blue-600 dark:text-blue-400 hover:text-blue-700',
    }
  }
];

// ==========================================
// 1. PUBLIC HEADER (Mobile Optimized)
// ==========================================
function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false); // Close menu on click
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 md:w-1/3 flex justify-start">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex md:w-1/3 justify-center gap-6 lg:gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            <button onClick={() => scrollToSection('facilities')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider text-[0.70rem] lg:text-[0.75rem]">
              Facilities
            </button>
            <button onClick={() => scrollToSection('architecture')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider text-[0.70rem] lg:text-[0.75rem]">
              Architecture
            </button>
            <button onClick={() => scrollToSection('modules')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider text-[0.70rem] lg:text-[0.75rem]">
              Subsystems
            </button>
          </nav>

          {/* Right: Actions & Mobile Toggle */}
          <div className="flex items-center justify-end gap-3 md:w-1/3">
            <ThemeToggle />
            
            {/* Desktop Login */}
            <Link 
              to="/auth" 
              className="hidden sm:flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 lg:px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-cyan-500/40"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>System Login</span>
            </Link>

            {/* Mobile Login Icon (Visible only on very small screens) */}
            <Link 
              to="/auth" 
              className="sm:hidden flex items-center justify-center bg-cyan-600 text-white p-2.5 rounded-full shadow-lg"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 py-6 flex flex-col gap-6">
          <button onClick={() => scrollToSection('facilities')} className="text-left text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest w-full">
            Facilities
          </button>
          <button onClick={() => scrollToSection('architecture')} className="text-left text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest w-full">
            Architecture
          </button>
          <button onClick={() => scrollToSection('modules')} className="text-left text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest w-full">
            Subsystems
          </button>
        </div>
      )}
    </header>
  );
}

// ==========================================
// 2. PUBLIC FOOTER
// ==========================================
function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t-4 border-cyan-600 dark:border-cyan-500 font-sans pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">About Polar Twin</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A comprehensive digital twin simulation engine modeling interdependent telemetry and supply chain workflows for extreme-environment research stations in Antarctica.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#facilities" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Geographical Facilities</a></li>
              <li><a href="#architecture" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">System Architecture</a></li>
              <li><a href="#modules" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Subsystems</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Organization</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              <strong>National Centre for Polar and Ocean Research (NCPOR)</strong>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ministry of Earth Sciences, India</p>
          </div>
        </div>
        <div className="border-t border-slate-300 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <span>&copy; {currentYear} Polar Twin Systems. All rights reserved.</span>
          <span className="font-mono text-cyan-600 dark:text-cyan-500 bg-cyan-100 dark:bg-cyan-950 px-2 py-1 rounded">SIH26060 | SYS_V1.0.0</span>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// 3. HERO SECTION
// ==========================================
function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden min-h-[85vh] flex items-center">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-6 sm:mb-8 shadow-sm">
          <Activity className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
          NCPOR Mission Control
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 sm:mb-8 leading-tight">
          Antarctic Digital Twin <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 block mt-2 sm:mt-0">
            Operations Command
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed font-medium px-2 sm:px-0">
          Real-time telemetry, predictive infrastructure monitoring, and dynamic supply chain management for India's extreme-environment research facilities.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-4 sm:px-0">
          <Link 
            to="/auth" 
            className="w-full sm:w-auto px-8 py-4 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 transition-all shadow-[0_4px_15px_rgba(8,145,178,0.3)] flex items-center justify-center gap-2"
          >
            Initialize Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#facilities" 
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center shadow-sm"
          >
            Explore Facilities
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 mt-16 pt-10 sm:pt-12 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">2</p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Active Stations</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">30+</p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Live Metrics</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">4</p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Core Systems</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. FACILITIES & MAP SECTION (Mobile Optimized)
// ==========================================
function FacilitiesSection() {
  return (
    <section id="facilities" className="py-16 md:py-24 bg-white dark:bg-[#0B1120] border-y border-slate-100 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Geographical Jurisdiction</h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Monitoring extreme-environment outposts situated thousands of kilometers from the Indian mainland, demanding zero-latency telemetry and robust logistical planning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
          
          <div className="lg:col-span-4 flex justify-center order-first lg:order-none">
            <AntarcticMap activeStation="Both" />
          </div>

          <div className="lg:col-span-8 grid gap-8">
            {stationData.map((station) => (
              <div 
                key={station.id} 
                // Using flex-col on mobile/tablet, flex-row on large desktops
                className={`group bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl ${station.theme.hover} transition-colors shadow-sm overflow-hidden flex flex-col lg:flex-row`}
              >
                {/* Embedded Image */}
                <div className="w-full lg:w-2/5 h-48 sm:h-56 lg:h-auto relative bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                  <img 
                    src={station.image} 
                    alt={station.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                
                {/* Card Content */}
                <div className="w-full lg:w-3/5 p-5 sm:p-8 flex flex-col justify-center">
                  
                  {/* Header: Title + Badge (Using flex-wrap for small screens) */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${station.theme.iconBg}`}>
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{station.name}</h3>
                        <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
                          <p><span className="font-semibold text-slate-700 dark:text-slate-300">Coordinates:</span> {station.coordinates}</p>
                          <p><span className="font-semibold text-slate-700 dark:text-slate-300">Established:</span> {station.established}</p>
                        </div>
                      </div>
                    </div>
                    
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[0.60rem] sm:text-[0.65rem] font-black uppercase tracking-widest rounded-full shrink-0 mt-1 sm:mt-0">
                      Online
                    </span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
                    {station.description}
                  </p>
                  
                  <a 
                    href={station.wikiLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold uppercase tracking-wider mt-auto transition-colors ${station.theme.link}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View Wikipedia Reference
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. ARCHITECTURE SECTION 
// ==========================================
function ArchitectureSection() {
  const features = [
    { text: "Secure routing with HTTP-only Cookies & JWT", icon: Shield },
    { text: "Global Event Bus for instant cross-module alerts", icon: Activity },
    { text: "Simulated asynchronous Node.js backend logic", icon: Gauge },
    { text: "High-performance React visualization architecture", icon: TrendingUp }
  ];

  return (
    <section id="architecture" className="py-16 md:py-24 bg-slate-50 dark:bg-[#060B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div>
            <div className="inline-block mb-4 sm:mb-6 px-4 py-1.5 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-400 rounded-full text-[0.65rem] font-bold uppercase tracking-widest border border-cyan-200 dark:border-cyan-800/50">
              System Design
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6">Built for Scale and Reliability.</h2>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed">
              Architected to handle complex state management seamlessly. Using a centralized context provider, alarms triggered in the Infrastructure module instantly notify operators viewing the Energy or Logistics dashboards.
            </p>
            
            <ul className="space-y-4 sm:space-y-6 mb-10">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <feature.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden mt-8 lg:mt-0">
            <div className="absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-emerald-500 -translate-x-1/2 opacity-20 dark:opacity-40"></div>
            
            <div className="relative z-10 space-y-6 sm:space-y-8">
              
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mb-3 sm:mb-4 text-blue-600 dark:text-blue-400">
                  <Database className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Simulation Engine</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">Environment, Energy, Infrastructure & Logistics</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-xl mb-3 sm:mb-4 text-cyan-600 dark:text-cyan-400">
                  <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Express API Backend</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">REST Processing, Alert Logic, Health Scoring</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl mb-3 sm:mb-4 text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">React Frontend</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">Real-time Visualization, Dashboards & Actions</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ==========================================
// 6. MODULES/SUBSYSTEMS SECTION
// ==========================================
function ModulesSection() {
  const modules = [
    { 
      name: "Infrastructure", 
      icon: ShieldAlert, 
      color: "from-red-500 to-rose-600",
      text: "text-red-500",
      desc: "Monitor module temperatures, HVAC status, fire alarms, and structural integrity in real-time."
    },
    { 
      name: "Energy & Power", 
      icon: Zap, 
      color: "from-amber-400 to-orange-500",
      text: "text-amber-500",
      desc: "Track generator status, fuel runways, live power load distribution, and battery backup."
    },
    { 
      name: "Environment", 
      icon: Snowflake, 
      color: "from-cyan-400 to-blue-500",
      text: "text-cyan-500",
      desc: "Analyze extreme exterior conditions, wind speeds, visibility, and automated blizzard warnings."
    },
    { 
      name: "Logistics", 
      icon: Network, 
      color: "from-indigo-400 to-purple-600",
      text: "text-purple-500",
      desc: "Manage the entire supply chain, track inventory requests, and oversee personnel status."
    }
  ];

  return (
    <section id="modules" className="py-16 md:py-24 bg-white dark:bg-[#0B1120] border-t border-slate-100 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6">Core Subsystems</h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Polar Twin simulates four interconnected subsystems, each processing massive telemetry datasets to keep operations alive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {modules.map((mod, i) => (
            <div 
              key={i} 
              className="relative group rounded-3xl sm:rounded-[2rem] p-[1.5px] overflow-hidden bg-slate-200 dark:bg-slate-800 transition-all duration-500 hover:shadow-2xl"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${mod.color}`}></div>
              
              <div className="relative h-full bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[30px] transition-all">
                <div className={`inline-flex p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 shadow-inner mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <mod.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${mod.text}`} />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">{mod.name}</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-5 sm:mb-6">{mod.desc}</p>
                
                <div className="pt-5 sm:pt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className={`text-[0.60rem] sm:text-[0.65rem] font-bold ${mod.text} uppercase tracking-widest flex items-center gap-2`}>
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse`}></span>
                    Live Connection Established
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 7. MAIN HOME COMPONENT
// ==========================================
export default function Home() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-300">
      <PublicHeader />
      <main>
        <HeroSection />
        <FacilitiesSection />
        <ArchitectureSection />
        <ModulesSection />
      </main>
      <PublicFooter />
    </div>
  );
}