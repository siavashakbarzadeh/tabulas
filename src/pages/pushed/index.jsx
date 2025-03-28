import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig"; // Adjust path if needed
import Loading from "../../layout/components/Loading.jsx";
import SearchIcon from "../../assets/svg/search.svg";

// Helper to format date/time
function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

export default function PushedMessagesPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5); // Show 5 at a time
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
    const visibleMessages = filteredMessages.slice(0, visibleCount);
    const totalPages = Math.ceil(filteredMessages.length / visibleCount);

    return (
        <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
            <div className="flex flex-col min-h-screen w-full">
                {/* Main White Container */}
                <div className="flex-1 bg-white rounded-2xl relative p-4">
                    {/* Full-width Search Bar */}
                    <form className="w-full mb-4">
                        <label className="relative block">
                            <input
                                type="text"
                                placeholder="Cerca..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setVisibleCount(5); // Reset visible count on new search
                                }}
                                className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-16 ring-0 focus:ring-0 focus:border-none"
                            />
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2"
                            />
                        </label>
                    </form>
                    {/* Header */}
                    <div className="bg-red-800 text-white p-4 rounded-t-xl font-semibold text-center">
                        Pushed Messages
                    </div>
                    {/* Content Card Container */}
                    <div className="p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loading />
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-gray-600">No messages found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {visibleMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="flex items-center p-4 bg-white shadow-sm rounded-md"
                                    >
                                        {/* Left Icon Area (with blurred background and centered foreground icon) */}
                                        <div className="flex-shrink-0 mr-4 relative w-14 h-14 rounded-md overflow-hidden">
                                            {msg.icon && (
                                                <>
                                                    <img
                                                        src={msg.icon}
                                                        alt="icon"
                                                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                                                        style={{ filter: "blur(1px)" }}
                                                    />
                                                    <img
                                                        src={msg.icon}
                                                        alt="icon"
                                                        className="absolute w-6 h-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                                    />
                                                </>
                                            )}
                                        </div>
                                        {/* Middle Content */}
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {msg.title}
                                            </h2>
                                            <p className="text-gray-600">{msg.body}</p>
                                        </div>
                                        {/* Right Side: Date and Read More Button */}
                                        <div className="ml-4 flex flex-col items-end">
                                            <p className="text-xs text-gray-500">
                                                {formatDate(msg.created_at)}
                                            </p>
                                            {msg.url && (
                                                <a
                                                    href={msg.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-2 bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700"
                                                >
                                                    Read more
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Load More Button */}
                        {visibleCount < filteredMessages.length && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 5)}
                                    className="w-full bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

