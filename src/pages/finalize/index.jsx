// src/pages/FinalizePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function FinalizePage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center p-4">
            <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl text-center">
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
    );
}

export default FinalizePage;
