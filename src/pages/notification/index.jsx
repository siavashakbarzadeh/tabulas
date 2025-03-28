import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import SearchIcon from "../../assets/svg/search.svg";
import axios from "../../configs/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NotificationPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notification, setNotification] = useState({
        title: "",
        body: "",
        icon: "/favicon.svg",
        url: "",
    });
    const [messageStatus, setMessageStatus] = useState("");

    useEffect(() => {
        async function registerPushNotifications() {
            if ("serviceWorker" in navigator && "PushManager" in window) {
                try {
                    // Register the service worker from the public folder
                    const registration = await navigator.serviceWorker.register("/sw.js");
                    console.log("Service Worker registered:", registration);

                    // Check for notification support and request permission
                    if (!("Notification" in window)) {
                        console.log("This browser does not support notifications.");
                        return;
                    }
                    const permission = await Notification.requestPermission();
                    if (permission !== "granted") {
                        console.log("Notification permission denied");
                        return;
                    }

                    // Check if there's an existing subscription and log it
                    const existingSubscription = await registration.pushManager.getSubscription();
                    if (existingSubscription) {
                        console.log("Existing subscription:", existingSubscription);
                    }

                    // Helper function to convert VAPID key from base64 to a Uint8Array
                    function urlBase64ToUint8Array(base64String) {
                        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
                        const base64 = (base64String + padding)
                            .replace(/-/g, "+")
                            .replace(/_/g, "/");
                        const rawData = window.atob(base64);
                        return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
                    }

                    const subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            "BDHaWPVr-4KGYKxoavcU_w2TUq5XqCDQHQQdJj4nhBBp2dqTExCrr8f2vUCr5Enp-dGkCD4Omohgk8qRjHtszBs"
                        ),
                    };

                    // Subscribe the user to push notifications
                    const subscription = await registration.pushManager.subscribe(subscribeOptions);
                    console.log("User is subscribed:", subscription);

                    // Send subscription to your backend using axios
                    await axios.post("/save-subscription", subscription);
                } catch (error) {
                    console.error("Error during service worker registration or subscription", error);
                }
            } else {
                console.log("Push messaging is not supported in this browser.");
            }
        }

        registerPushNotifications();
    }, []);


    const handleUpdateFormData = (fieldName, value) => {
        setNotification((prev) => ({ ...prev, [fieldName]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/push-notification", { messageData: notification });
            setMessageStatus("Notification sent successfully!");
            console.log("Notification pushed:", res.data);
        } catch (err) {
            console.error("Error pushing notification", err);
            setMessageStatus("Error sending notification.");
            toast.error(
                err.response?.data?.data?.message || "Error",
                { position: "bottom-right", hideProgressBar: true }
            );
        }
    };

    return (
        <div className="w-full flex pt-0 lg:pt-4 pb-2 lg:pb-4 pr-0 lg:pr-4 pl-0 lg:pl-2">
            <div className="flex flex-col min-h-screen w-full">
                {/* Main white container */}
                <div className="flex-1 bg-white rounded-2xl relative p-4">
                    {/* Full-width Search Bar */}
                    <form className="w-full mb-4">
                        <label className="w-full block relative before:w-px before:h-2/3 before:bg-neutral-300 before:absolute before:left-14 before:top-1/2 before:-translate-y-1/2">
                            <input
                                type="text"
                                placeholder="Cerca..."
                                className="w-full h-11 bg-neutral-200 text-sm rounded-xl border-none pl-18 ring-0 focus:ring-0 focus:border-none"
                            />
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className="w-6 h-6 select-none absolute left-4 top-1/2 -translate-y-1/2"
                            />
                        </label>
                    </form>
                    {/* Main Notification Form Container */}
                    <div className="flex w-full">
                        <div className="p-4 flex-1 flex justify-center items-start">
                            <div className="gap-4 w-8/12 lg:w-8/12 p-4 bg-gray-100 rounded-xl drop-shadow-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <h2 className="text-lg font-semibold mb-4">Invia Notifica</h2>
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        onChange={(e) => handleUpdateFormData("title", e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <textarea
                                        name="body"
                                        placeholder="Body"
                                        value={notification.body}
                                        onChange={(e) => handleUpdateFormData("body", e.target.value)}
                                        className="w-full p-2 border rounded"
                                    ></textarea>
                                    <input
                                        type="hidden"
                                        name="icon"
                                        placeholder="Icon URL"
                                        value={notification.icon}
                                        onChange={(e) => handleUpdateFormData("icon", e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <input
                                        type="text"
                                        name="url"
                                        placeholder="Target URL"
                                        value={notification.url}
                                        onChange={(e) => handleUpdateFormData("url", e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-primary-900 text-white rounded"
                                    >
                                        Invia Notifica
                                    </button>
                                </form>
                                {messageStatus && <p className="mt-2 text-sm">{messageStatus}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationPage;
