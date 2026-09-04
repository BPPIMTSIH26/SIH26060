export default function Footer() {
  const currentYear = new Date().getFullYear();

  const lastReviewedDate = new Date().toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    // A thick saffron/amber top border with a solid dark slate background is classic GOI styling
    <footer className="bg-[#1e293b] dark:bg-slate-950 border-t-4 border-gray-800 w-full font-sans mt-10">
      
      {/* SECTION 1: Policy Links with Pipe (|) Separators */}
      <div className="bg-[#0f172a] dark:bg-black/40 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-gray-300">
            <li><a href="#" className="hover:text-white hover:underline transition-all">Website Policies</a></li>
            <li className="text-gray-600">|</li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Help</a></li>
            <li className="text-gray-600">|</li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Contact Us</a></li>
            <li className="text-gray-600">|</li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Terms and Conditions</a></li>
            <li className="text-gray-600">|</li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Feedback</a></li>
            <li className="text-gray-600">|</li>
            <li><a href="#" className="hover:text-white hover:underline transition-all">Web Information Manager</a></li>
          </ul>
        </div>
      </div>

      {/* SECTION 2: Official Attributions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400">
        
        <p className="text-xs sm:text-sm mb-2">
          This website belongs to <strong className="text-gray-200">National Centre for Polar and Ocean Research (NCPOR)</strong>,<br className="hidden sm:block"/>
          Ministry of Earth Sciences, Government of India.
        </p>

        <p className="text-[11px] sm:text-xs text-gray-500 mb-5 leading-relaxed">
          Designed, Developed and Hosted by <strong className="text-gray-300">National Informatics Centre (NIC)</strong>,<br className="hidden sm:block"/>
          Ministry of Electronics & Information Technology, Government of India.
        </p>

        {/* SECTION 3: Copyright, Version & Last Updated */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-[11px] text-gray-500 pt-4 border-t border-gray-700/50">
          <span className="font-semibold px-2 py-0.5 border border-red-500/30 text-red-400 bg-red-500/10 rounded-sm">
            RESTRICTED ACCESS
          </span>
          <span className="hidden sm:inline">|</span>
          <span>Last Updated: <strong className="text-gray-300">{lastReviewedDate}</strong></span>
          <span className="hidden sm:inline">|</span>
          <span>&copy; {currentYear} NCPOR</span>
          <span className="hidden sm:inline">|</span>
          <span className="font-mono">SYS_V1.0.4</span>
        </div>
        
      </div>
    </footer>
  );
}