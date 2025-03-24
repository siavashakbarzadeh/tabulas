import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig"; // Adjust path if needed
import Loading from "../../layout/components/Loading.jsx";

// Helper to format date/time
function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

export default function PushedMessagesPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5); // Show 5 at a time

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            // Fetch from your Laravel endpoint
            const res = await axios.get("/pushed-messages");
            setMessages(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pushed messages:", error);
            setLoading(false);
        }
    };

    // Slice the messages array based on visibleCount
    const visibleMessages = messages.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white w-full">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Pushed Messages</h1>
            {messages.length === 0 ? (
                <p className="text-center text-gray-600">No messages found.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {visibleMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className="flex items-center p-4 bg-white shadow-sm rounded-md"
                            >
                                {/* Left icon area with blurred background + small foreground icon */}
                                <div className="flex-shrink-0 mr-4 relative w-14 h-14 rounded-md overflow-hidden">
                                    {msg.icon && (
                                        <>
                                            {/* Blurred, opaque background image */}
                                            <img
                                                src={msg.icon}
                                                alt="icon"
                                                className="absolute inset-0 w-full h-full object-cover opacity-30"
                                                style={{ filter: "blur(1px)" }}
                                            />

                                        </>
                                    )}
                                </div>

                                {/* Middle content: title + body */}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {msg.title}
                                    </h2>
                                    <p className="text-gray-600">{msg.body}</p>
                                </div>

                                {/* Right side: date + button */}
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

                    {/* Load More button if there are more messages to show */}
                    {visibleCount < messages.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleLoadMore}
                                className="w-full bg-red-800 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
