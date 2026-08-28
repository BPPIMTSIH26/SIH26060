import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen px-4 text-center">

            {/* Icon Container */}
            <div className="bg-gray-100 dark:bg-slate-800/50 p-6 rounded-full mb-6 border border-gray-200 dark:border-slate-700">
                <MapPinOff className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
            </div>

            {/* 404 Status */}
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                404
            </h1>

            {/* Thematic Title */}
            <h2 className="text-xl font-bold text-gray-700 dark:text-slate-300 mb-4">
                Uncharted Coordinates
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                The route you are looking for does not correspond to any known sector in the Maitri or Bharati station grids. The page may have been moved or doesn't exist.
            </p>

            {/* Return Button */}
            <Link
                to="/"
                className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
            </Link>

        </div>
    );
}