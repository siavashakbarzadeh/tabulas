// AccessibilityWidget.jsx
import React from "react";

function AccessibilityWidget({
    largeText, setLargeText,
    highContrast, setHighContrast
}) {
    const toggleLargeText = () => setLargeText(!largeText);
    const toggleHighContrast = () => setHighContrast(!highContrast);

    return (
        <div className="fixed bottom-4 left-4 p-3 bg-white shadow-md border rounded z-10">
            <h2 className="font-semibold mb-2">Accessibilità</h2>
            <div className="flex items-center space-x-2 mb-2">
                <label className="cursor-pointer">Testo Grande</label>
                <input
                    type="checkbox"
                    checked={largeText}
                    onChange={toggleLargeText}
                />
            </div>
            <div className="flex items-center space-x-2 mb-2">
                <label className="cursor-pointer">Alto Contrasto (AA)</label>
                <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={toggleHighContrast}
                />
            </div>
        </div>
    );
}

export default AccessibilityWidget;
