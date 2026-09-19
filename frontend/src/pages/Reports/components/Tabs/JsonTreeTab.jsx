import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const JsonNode = ({ label, value, isLast }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    const renderValue = () => {
        if (typeof value === 'string') return <span className="text-emerald-600 dark:text-emerald-400">"{value}"</span>;
        if (typeof value === 'number') return <span className="text-cyan-600 dark:text-cyan-400">{value}</span>;
        if (typeof value === 'boolean') return <span className="text-amber-600 dark:text-amber-400">{value ? 'true' : 'false'}</span>;
        if (value === null) return <span className="text-slate-500 italic">null</span>;
        return null;
    };

    if (!isObject) {
        return (
            <div className="pl-6 py-0.5 font-mono text-[13px] hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded flex items-start">
                {label && <span className="text-rose-600 dark:text-rose-400 font-medium mr-2">"{label}":</span>}
                {renderValue()}
                {!isLast && <span className="text-slate-500">,</span>}
            </div>
        );
    }

    const keys = Object.keys(value);
    return (
        <div className="font-mono text-[13px]">
            <div
                className="flex items-center py-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="w-4 h-4 flex items-center justify-center mr-1 text-slate-400">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </span>
                {label && <span className="text-rose-600 dark:text-rose-400 font-medium mr-2">"{label}":</span>}
                <span className="text-slate-500">{isArray ? '[' : '{'}</span>
                {!isExpanded && <span className="text-slate-500 ml-2">... {isArray ? ']' : '}'}{!isLast && ','}</span>}
            </div>

            {isExpanded && (
                <div className="pl-6 border-l border-slate-200 dark:border-slate-800 ml-2">
                    {keys.map((key, index) => (
                        <JsonNode key={key} label={isArray ? null : key} value={value[key]} isLast={index === keys.length - 1} />
                    ))}
                </div>
            )}
            {isExpanded && <div className="pl-2 text-slate-500">{isArray ? ']' : '}'}{!isLast && ','}</div>}
        </div>
    );
};

export default function JsonTreeTab({ reportData, reportCategory }) {
    // Scopes the JSON tree so users don't have to scroll through irrelevant domains
    const getScopedPayload = () => {
        if (reportCategory === 'overall') return reportData;

        const scoped = {
            report_id: reportData.report_id,
            station_id: reportData.station_id,
            report_metadata: reportData.report_metadata,
            system_health_breakdown: reportData.system_health_breakdown
        };

        if (reportCategory === 'energy') scoped.energy_analysis = reportData.energy_analysis;
        if (reportCategory === 'environment') scoped.environment_analysis = reportData.environment_analysis;
        if (reportCategory === 'logistics') scoped.logistics_analysis = reportData.logistics_analysis;
        if (reportCategory === 'infrastructure') scoped.infrastructure_analysis = reportData.infrastructure_analysis;

        return scoped;
    };

    return (
        <div className="h-full bg-white dark:bg-[#0a0f1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-auto animate-in fade-in shadow-sm">
            <JsonNode value={getScopedPayload()} isLast={true} />
        </div>
    );
}