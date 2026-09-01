import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ 
    label,
    name, // Added 'name' prop to better integrate with your form states
    value, 
    onChange, 
    options, 
    disabled = false,
    error = null,
    required = false 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options?.find(opt => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full" ref={dropdownRef}>
            {label && (
                <label className="block text-[0.65rem] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all focus:outline-none ${
                        error
                            ? 'border-red-400 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10 text-red-900 dark:text-red-200'
                            : isOpen
                            ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white'
                            : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 hover:border-gray-300 dark:hover:border-slate-700 text-gray-900 dark:text-slate-100'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <span className={`truncate ${!selectedOption ? 'text-gray-400 dark:text-gray-500 font-normal' : ''}`}>
                        {selectedOption?.label || 'Select an option...'}
                    </span>
                    <ChevronDown
                        size={16}
                        strokeWidth={2.5}
                        className={`transition-transform duration-300 shrink-0 ${
                            error ? 'text-red-400' : isOpen ? 'text-cyan-500' : 'text-gray-400 dark:text-slate-500'
                        } ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-xl scrollbar-hide">
                        {options?.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    // Passes back an event-like object to match standard form handlers
                                    onChange({ target: { name: name || label?.toLowerCase(), value: option.value } });
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                                    value === option.value
                                        ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold'
                                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 font-medium'
                                }`}
                            >
                                <span className="text-left truncate">{option.label}</span>
                                {value === option.value && (
                                    <Check size={16} strokeWidth={3} className="shrink-0 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-500 dark:text-red-400 text-[0.7rem] font-bold mt-1.5 font-mono uppercase tracking-wider">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CustomDropdown;