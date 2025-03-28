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
        <div className="min-h-screen bg-white p-4 w-full">
            {/* Full-width Search Bar */}
            <form className="w-full mx-auto mb-6">
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
            <div className="bg-white mx-auto w-full">
                {/* Header */}


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
                            <tr className="bg-red-800 text-white">
                                <th className="py-3 px-4 text-left">Notifiche inviati</th>
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
                                                <img
                                                    src={msg.icon}
                                                    alt="icon"
                                                    className="absolute w-6 h-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                                />
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    {/* Title Column */}
                                    <td className="py-3 px-4">
                                        <p className="font-semibold">
                                            {msg.title || "No Title"}
                                        </p>
                                    </td>
                                    <td>{msg.body}</td>
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
