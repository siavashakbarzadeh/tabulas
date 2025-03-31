import React from "react";

function AccessibilityWidget({
    largeText, setLargeText,
    highContrast, setHighContrast
}) {
    const toggleLargeText = () => setLargeText(!largeText);
    const toggleHighContrast = () => setHighContrast(!highContrast);

    return (
        <div className="fixed bottom-4 left-4 p-3 bg-white shadow-md border rounded z-10">
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
                    {/* Track */}
                    <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer 
              peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600
              peer-checked:bg-blue-600 transition-colors duration-200"
                    />
                    {/* Thumb */}
                    <div
                        className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full 
              border border-gray-300 transition-all duration-200 
              peer-checked:translate-x-5"
                    />
                </label>
            </div>

            {/* HIGH CONTRAST TOGGLE */}
            <div className="flex items-center justify-between mb-3">
                <span className="cursor-pointer mr-2">Alto Contrasto (AA)</span>
                <label className="inline-flex relative items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={highContrast}
                        onChange={toggleHighContrast}
                    />
                    {/* Track */}
                    <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer
              peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600
              peer-checked:bg-blue-600 transition-colors duration-200"
                    />
                    {/* Thumb */}
                    <div
                        className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full
              border border-gray-300 transition-all duration-200
              peer-checked:translate-x-5"
                    />
                </label>
            </div>
        </div>
    );
}

export default AccessibilityWidget;
