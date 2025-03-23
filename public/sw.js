// sw.js
self.addEventListener("push", event => {
    console.log("Push event received:", event);

    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (err) {
            console.error("Error parsing push data", err);
        }
    }

    const title = data.title || "New Notification";
    const options = {
        body: data.body || "You have a new message",
        icon: data.icon || "",
        data: {
            url: data.url || "/"
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then(clientList => {
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
