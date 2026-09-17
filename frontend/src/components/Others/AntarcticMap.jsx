
import { MapPin } from "lucide-react";

export default function AntarcticMap({ activeStation = "Maitri" }) {
    const mapUrl = "/models/image.png";

    // Determine which stations should pulse and highlight
    const highlightMaitri = activeStation === "Maitri" || activeStation === "Both";
    const highlightBharati = activeStation === "Bharati" || activeStation === "Both";

    return (
        <div className="flex flex-col items-center w-full font-sans">
            <div className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-4 border-white dark:border-slate-800 bg-[#c6e4f4]">
                
                <img 
                    src={mapUrl} 
                    alt="Topographical Map of Antarctica" 
                    className="w-full h-full object-cover block"
                />

                {/* MAITRI MARKER */}
                <div 
                    className="absolute z-10 flex items-center group cursor-default" 
                    style={{ top: "18.614%", left: "56.518%" }}
                >
                    {highlightMaitri && (
                        <span className="absolute -left-2 -top-2 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        </span>
                    )}
                    <div 
                        className={`absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full shadow-[0_0_0_1.5px_rgba(255,255,255,0.9)] transition-colors duration-300 ${
                            highlightMaitri ? "bg-cyan-500 scale-125 z-20" : "bg-slate-400 dark:bg-slate-600"
                        }`}
                    />
                    <div 
                        className={`absolute left-3 w-max px-2 py-0.5 rounded-md text-[0.6rem] font-bold tracking-wide backdrop-blur-md transition-all duration-300 shadow-sm ${
                            highlightMaitri 
                                ? "bg-white/95 text-slate-900 dark:bg-slate-900/95 dark:text-white border border-slate-200 dark:border-slate-700 z-20" 
                                : "bg-white/60 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400 border border-transparent"
                        }`}
                    >
                        Maitri
                    </div>
                </div>

                {/* BHARATI MARKER */}
                <div 
                    className="absolute z-10 flex items-center group cursor-default" 
                    style={{ top: "41.806%", left: "83.327%" }}
                >
                    {highlightBharati && (
                        <span className="absolute -left-2 -top-2 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        </span>
                    )}
                    <div 
                        className={`absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full shadow-[0_0_0_1.5px_rgba(255,255,255,0.9)] transition-colors duration-300 ${
                            highlightBharati ? "bg-cyan-500 scale-125 z-20" : "bg-slate-400 dark:bg-slate-600"
                        }`}
                    />
                    <div 
                        className={`absolute right-3 w-max px-2 py-0.5 rounded-md text-[0.6rem] font-bold tracking-wide backdrop-blur-md transition-all duration-300 shadow-sm ${
                            highlightBharati 
                                ? "bg-white/95 text-slate-900 dark:bg-slate-900/95 dark:text-white border border-slate-200 dark:border-slate-700 z-20" 
                                : "bg-white/60 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400 border border-transparent"
                        }`}
                    >
                        Bharati
                    </div>
                </div>

            </div>
            
            {/* Optional Legend */}
            <div className="mt-3 flex items-center gap-2 text-[0.65rem] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <MapPin className="w-3 h-3" />
                NCPOR Facilities
            </div>
        </div>
    );
}