import React from 'react';

const NewsTicker = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* Longer Search Box with Icon and Cerca Text */}
            <div className="relative w-full md:w-96"> {/* Full width on mobile, fixed on medium+ screens */}
                <div className="absolute inset-y-0 left-3 flex items-center gap-2 text-gray-400 text-sm">
                    <em className="ni ni-search"></em> {/* Search Icon */}
                    <div className="h-6 w-px bg-gray-300"></div> {/* Vertical Bar */}
                    <span className="text-gray-400">Cerca</span> {/* Cerca Text */}
                </div>
                <input
                    type="text"
                    className="w-full h-10 pl-28 pr-3 py-2 text-sm bg-gray-100 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
            </div>
        </div>
    );
};

export default NewsTicker;
