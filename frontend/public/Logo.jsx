import React from "react";
import { Link } from "react-router-dom";
import { Snowflake } from "lucide-react";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-3 cursor-pointer">

            {/* Official Seal / Badge Container (Reduced from w-16 to w-12 for balance) */}
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

                {/* Inner Circular Polar Mark (Scaled down to fit new container) */}
                <div className="relative z-10 h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <Snowflake size={14} strokeWidth={2.5} className="text-white" />
                </div>
            </div>

            {/* Institutional Identity (Scaled up text to balance with the logo height) */}
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