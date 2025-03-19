// src/pages/InboxPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from "../../assets/svg/search.svg";

function InboxPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user && user.id) {
            axios
                .get(`/applications/inbox/${user.id}`)
                .then((res) => {
                    // Assuming response structure: res.data.data.applications (an array)
                    setApplications(res.data.data.applications || []);
                })
                .catch(() => {
                    toast.error("Failed to load inbox applications");
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    // Optional filtering on the front end
    const filteredApplications = applications.filter((app) =>
        app.act_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleView = (id) => {
        navigate(`/confirm/${id}`);
    };

    const handleQuickVerify = (id) => {
        // Example quick verification call (adjust as needed)
        axios
            .post(`/applications/${id}/verify`)
            .then(() => {
                toast.success("Application verified");
            })
            .catch(() => {
                toast.error("Quick verification failed");
            });
    };

    if (loading) return <div>Loading...</div>;

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
                    {/* Inbox Table */}
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <h2 className="text-xl font-semibold mb-4">Inbox</h2>
                        {filteredApplications.length === 0 ? (
                            <p>No applications found.</p>
                        ) : (
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Tipo Atto</th>
                                        <th className="px-4 py-2 text-left">Mittente</th>
                                        <th className="px-4 py-2 text-left">Data Invio</th>
                                        <th className="px-4 py-2 text-left">Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map((app) => (
                                        <tr key={app.id} className="border-b hover:bg-gray-100">
                                            <td className="px-4 py-2">{app.id}</td>
                                            <td className="px-4 py-2">{app.act_type}</td>
                                            <td className="px-4 py-2">{app.name}</td>
                                            <td className="px-4 py-2">{app.submission_date}</td>
                                            <td className="px-4 py-2 space-x-2">
                                                <button
                                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                                    onClick={() => handleView(app.id)}
                                                >
                                                    Visualizza
                                                </button>
                                                <button
                                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                                    onClick={() => handleQuickVerify(app.id)}
                                                >
                                                    Verifica Rapida
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
        </div>
    );
}

export default InboxPage;
