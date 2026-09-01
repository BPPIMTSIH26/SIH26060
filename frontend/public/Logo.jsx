import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-3 cursor-pointer">

            {/* Official Seal / Badge Container */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">

                {/* The Curved Text (SVG) */}
                <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Path radius adjusted to ensure text does not get cut off */}
                    <path
                        id="textPath"
                        d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                        fill="none"
                    />
                    <text
                        className="fill-gray-500 dark:fill-slate-400 font-bold uppercase"
                        fontSize="9.5"
                        letterSpacing="0.5"
                    >
                        {/* Native SVG attributes ensure the text spaces properly without overlapping */}
                        <textPath href="#textPath" startOffset="0%">
                            MINISTRY OF EARTH SCIENCES • GOVT OF INDIA •
                        </textPath>
                    </text>
                </svg>

                {/* Inner Circular Polar Mark (Updated for blue Antarctica image) */}
                {/* Changed the background to white so the blue image pops, slightly scaled up to h-7 w-7 */}
                <div className="relative z-10 h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden">
                    <img 
                        src="/image.png" 
                        alt="Antarctica Map" 
                        className="w-full h-full object-contain p-0.5" 
                    />
                </div>
            </div>

            {/* Institutional Identity */}
            <div className="flex flex-col justify-center">
                <span className="text-lg font-extrabold tracking-wide leading-none text-gray-900 dark:text-white">
                    NCPOR
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 leading-none">
                    Polar Twin
                </span>
            </div>

        </Link>
    );
}