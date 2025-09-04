self.addEventListener("push", function (event) {
  event.waitUntil(
    (async () => {
      let data = {};

      const rawText = await event.data.text();

      data = JSON.parse(rawText);

      const title = data.title || "通知";
      const options = {
        body: data.body || "新しい通知があります。",
        icon: data.icon || "/logo.png",
        badge: data.badge || "/logo.png",
        tag: Date.now().toString(),
        renotify: true,
        data: { url: data.url || "/" },
        requireInteraction: true,
      };

      await self.registration.showNotification(title, options);
    })()
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
