import React, { useState } from "react";

function AccessibilityWidget({
    largeText,
    setLargeText,
    highContrast,
    setHighContrast,
}) {
    const [open, setOpen] = useState(false);

    const toggleLargeText = () => setLargeText(!largeText);
    const toggleHighContrast = () => setHighContrast(!highContrast);
    const toggleMenu = () => setOpen(!open);

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {/* Floating Button */}
            <button
                onClick={toggleMenu}
                className="bg-gray-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-gray-700 transition"
                aria-label="Accessibilità"
            >
                <i className="fa-duotone fa-universal-access text-xl"></i>
            </button>

            {/* Accessibility Menu */}
            {open && (
                <div className="mt-2 p-4 w-64 bg-white shadow-xl border rounded-md animate-fade-in">
                    <h2 className="font-semibold mb-3">Accessibilità</h2>

                    {/* LARGE TEXT TOGGLE */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="cursor-pointer mr-2">Testo Grande</span>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={largeText}
                                onChange={toggleLargeText}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200" />
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full border border-gray-300 transition-all duration-200 peer-checked:translate-x-5" />
                        </label>
                    </div>

                    {/* HIGH CONTRAST TOGGLE */}
                    <div className="flex items-center justify-between mb-1">
                        <span className="cursor-pointer mr-2">Alto Contrasto (AA)</span>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={highContrast}
                                onChange={toggleHighContrast}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200" />
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full border border-gray-300 transition-all duration-200 peer-checked:translate-x-5" />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccessibilityWidget;
