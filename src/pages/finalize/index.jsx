// src/pages/FinalizePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../../assets/svg/search.svg";

function FinalizePage() {
    const navigate = useNavigate();

    return (
        <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
            <div className="flex flex-col min-h-screen w-full">
                {/* Main white container */}
                <div className="flex-1 bg-white rounded-2xl relative p-4">
                    {/* Search Bar */}
                    <form className="w-full mb-4">
                        <label className="w-full block relative">
                            <input
                                type="text"
                                placeholder="Cerca..."
                                className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
                            />
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
                            />
                        </label>
                    </form>
                    <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-semibold mb-4">Grazie!</h2>
                        <p className="mb-4">
                            Il tuo documento è stato inviato alla segreteria.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Torna alla Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinalizePage;
