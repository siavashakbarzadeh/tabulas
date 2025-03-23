import { useState, useEffect } from "react";
import axios from "../../configs/axiosConfig.js";
import SearchIcon from "../../assets/svg/search.svg";

function NotificationPage() {
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

                    // Check if there's an existing subscription and log it (or unsubscribe if needed)
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
                        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
                    }

                    const subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BDHaWPVr-4KGYKxoavcU_w2TUq5XqCDQHQQdJj4nhBBp2dqTExCrr8f2vUCr5Enp-dGkCD4Omohgk8qRjHtszBs"),
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

    // Handle changes in the notification form
    const handleChange = (e) => {
        setNotification({ ...notification, [e.target.name]: e.target.value });
    };

    // Submit the notification details to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/push-notification", { messageData: notification });
            setMessageStatus("Notification sent successfully!");
            console.log("Notification pushed:", res.data);
        } catch (err) {
            console.error("Error pushing notification", err);
            setMessageStatus("Error sending notification.");
        }
    };

    return (
        <>
            <div className="w-full bg-white rounded-tl-none lg:rounded-tl-2xl rounded-tr-none lg:rounded-tr-2xl rounded-bl-2xl rounded-br-2xl relative px-4 pt-4 pb-13">
                <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    {/* Sidebar Column */}
                    <div className="w-full md:w-1/3">
                        <form>
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
                        {/* Additional sidebar content (if needed) can be added here */}
                    </div>

                    {/* Main Notification Form Column */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-neutral-200 rounded-2xl p-6 text-zinc-800 space-y-4 leading-7">
                            <h2 className="text-lg font-semibold mb-4">Send Notification</h2>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={notification.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                                <textarea
                                    name="body"
                                    placeholder="Body"
                                    value={notification.body}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                ></textarea>
                                <input
                                    type="text"
                                    name="icon"
                                    placeholder="Icon URL"
                                    value={notification.icon}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="url"
                                    placeholder="Target URL"
                                    value={notification.url}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                                <button type="submit" className="w-full py-2 bg-primary-900 text-white rounded">
                                    Send Notification
                                </button>
                            </form>
                            {messageStatus && <p className="mt-2 text-sm">{messageStatus}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotificationPage;
