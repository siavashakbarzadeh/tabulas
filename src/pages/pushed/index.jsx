import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig"; // Adjust path if needed
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

// Helper to format date/time
function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

const ITEMS_PER_PAGE = 10;

export default function PushedMessagesPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            // Fetch from your backend endpoint for pushed messages
            const res = await axios.get("/pushed-messages");
            setMessages(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pushed messages:", error);
            setLoading(false);
        }
    };

    // Filter messages based on search query (by title or body)
    const filteredMessages = messages.filter((msg) =>
        (msg.title && msg.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (msg.body && msg.body.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Slice the filtered messages for pagination
    const displayedMessages = filteredMessages.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 w-full">
            {/* Full-width Search Bar */}
            <form className="w-full max-w-3xl mx-auto mb-6">
                <label className="relative w-full flex items-center bg-gray-100 border border-gray-200 rounded-xl px-4">
                    <img src={SearchIcon} alt="Search" className="w-6 h-6 mr-2" />
                    <input
                        type="text"
                        placeholder="Cerca..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setVisibleCount(ITEMS_PER_PAGE); // Reset visible count on new search
                        }}
                        className="w-full h-11 bg-gray-100 text-gray-800 text-sm border-none focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-xl"
                    />
                </label>
            </form>

            {/* Main Content Container */}
            <div className="bg-white mx-auto w-full max-w-3xl rounded-2xl shadow-lg p-4">
                {/* Header */}
                <div className="bg-red-800 text-white p-4 rounded-t-xl font-semibold text-center">
                    Pushed Messages
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loading />
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600">No messages found.</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr
                                style={{ position: "sticky", top: 0, zIndex: 10 }}
                                className="bg-red-800 text-white"
                            >
                                <th className="py-3 px-4 text-left">Icona</th>
                                <th className="py-3 px-4 text-left">Titolo</th>
                                <th className="py-3 px-4 text-left">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedMessages.map((msg, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    {/* Icon Column */}
                                    <td className="py-3 px-4">
                                        {msg.icon && msg.icon !== "-" ? (
                                            <a
                                                href={msg.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="fa-duotone fa-bell text-xl text-red-800"></i>
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    {/* Title Column */}
                                    <td className="py-3 px-4">
                                        <a
                                            href={msg.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {msg.title || "No Title"}
                                        </a>
                                    </td>
                                    {/* Date Column */}
                                    <td className="py-3 px-4">{formatDate(msg.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Load More Button */}
                {visibleCount < filteredMessages.length && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                            className="w-full bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
