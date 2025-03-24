
import { useEffect, useState } from "react";
import axios from "../../configs/axiosConfig.js";
import Loading from "../../layout/components/Loading.jsx";

function PushedMessagesPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get("/pushed-messages");
            setMessages(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 w-full">
            <h1 className="text-3xl font-bold mb-6 text-left">Pushed Messages</h1>
            {messages.length === 0 ? (
                <p className="text-center text-gray-600">No messages found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-2">{msg.title}</h2>
                            <p className="text-gray-700 mb-4">{msg.body}</p>
                            {msg.icon && (
                                <img
                                    src={msg.icon}
                                    alt="icon"
                                    className="w-10 h-10 mb-4"
                                />
                            )}
                            {msg.url && (
                                <a
                                    href={msg.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Learn more
                                </a>
                            )}
                            <p className="text-xs text-gray-500 mt-4">
                                {new Date(msg.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PushedMessagesPage;
