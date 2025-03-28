// src/pages/OutboxPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import SearchIcon from "../../assets/svg/search.svg";

/**
 * This component:
 * 1) Lists applications in a table
 * 2) On "Apri PDF" click, fetches that application and shows a modal with an iframe PDF
 * 3) No page navigation.
 */
function OutboxPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // For the modal
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null); // store the fetched application
    const [pdfLoading, setPdfLoading] = useState(false);

    // 1) Fetch the list of outbox applications
    useEffect(() => {
        if (user && user.id) {
            axios
                .get(`/applications/outbox/${user.id}`)
                .then((res) => {
                    setApplications(res.data.data.applications || []);
                })
                .catch(() => {
                    toast.error("Failed to load outbox applications");
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    // 2) Filter the outbox applications by search query
    const filteredApplications = applications.filter((app) =>
        (app.act_type && app.act_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.document?.original_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 3) When the user clicks "Apri PDF," fetch that application and open the modal
    const handleView = async (appId) => {
        try {
            setPdfLoading(true);
            const res = await axios.get(`/applications/${appId}`);
            const application = res.data.data.application;
            setSelectedApp(application);
            setShowModal(true);
        } catch (error) {
            toast.error("Failed to load application preview");
        } finally {
            setPdfLoading(false);
        }
    };

    // 4) Close the modal and reset
    const closeModal = () => {
        setShowModal(false);
        setSelectedApp(null);
    };

    if (loading) return <div>Loading...</div>;

    // Example PDF URL from selectedApp
    const pdfUrl = selectedApp?.document?.files?.original || null;

    return (
        <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
            <div className="flex flex-col min-h-screen w-full">
                {/* Container with Search Bar */}
                <div className="flex-1 bg-white rounded-2xl relative p-4">
                    {/* Search Bar */}
                    <form className="w-full mb-4">
                        <label className="relative block">
                            <input
                                type="text"
                                placeholder="Cerca..."
                                className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-16"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
                            />
                        </label>
                    </form>
                    {/* Outbox Table */}
                    <div className="bg-white">
                        <h2 className="font-semibold mb-4 p-4 bg-red-800 w-full text-white">
                            Outbox
                        </h2>
                        {filteredApplications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <i className="fa-duotone fa-envelope-open text-6xl text-red-800 mb-4"></i>
                                <p className="text-gray-500">Nessuna applicazione trovata.</p>
                            </div>
                        ) : (
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-2 text-left">Nome File</th>
                                        <th className="px-4 py-2 text-left">Data e Ora Invio</th>
                                        <th className="px-4 py-2 text-left">Tipo Atto</th>
                                        <th className="px-4 py-2 text-left">Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map((app) => (
                                        <tr key={app.id} className="border-b hover:bg-gray-100">
                                            <td className="px-4 py-2">
                                                {app.document?.original_name || "N/A"}
                                            </td>
                                            <td className="px-4 py-2">{app.submission_date}</td>
                                            <td className="px-4 py-2">{app.act_type}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                                                    onClick={() => handleView(app.id)}
                                                >
                                                    <i className="fa-duotone fa-eye"></i>
                                                    <span>Apri PDF</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={closeModal} // close modal on overlay click
                >
                    {/* Modal Content */}
                    <div
                        className="bg-white w-full max-w-3xl p-6 rounded shadow-lg relative"
                        onClick={(e) => e.stopPropagation()} // prevent close on content click
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <i className="fa-duotone fa-times text-xl"></i>
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Anteprima Atto</h2>

                        {pdfLoading ? (
                            <div className="h-96 flex items-center justify-center">
                                <p>Loading PDF...</p>
                            </div>
                        ) : pdfUrl ? (
                            <iframe
                                src={pdfUrl}
                                title="PDF Preview"
                                className="w-full h-96 mb-4"
                            />
                        ) : (
                            <p>Nessun documento caricato.</p>
                        )}

                        {selectedApp && (
                            <div className="mb-4">
                                <p>
                                    <strong>Tipo Atto:</strong> {selectedApp.act_type}
                                </p>
                                <p>
                                    <strong>Ufficio Destinatario:</strong>{" "}
                                    {selectedApp.recipient_office}
                                </p>
                                <p>
                                    <strong>Data Invio:</strong> {selectedApp.submission_date}
                                </p>
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                onClick={() => {
                                    toast.success("Confirmed!");
                                    closeModal();
                                }}
                                className="bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Conferma
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-neutral-200 text-dark px-4 py-2 rounded"
                            >
                                No Grazie
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OutboxPage;
