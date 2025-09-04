import { ToastStatus } from "@/constants/toast";
import { POST } from "@/lib/api";

interface PushSubscriptionPayload {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

export async function registerPush(
  publicKey: string,
  showToast: (msg: string, status: ToastStatus) => void
) {
  if (!publicKey) {
    showToast("公開VAPIDキーが見つかりません", ToastStatus.WARNING);
    return;
  }

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    showToast(
      "このブラウザはプッシュ通知に対応していません",
      ToastStatus.WARNING
    );
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      showToast(
        "通知が許可されなかったため、プッシュ通知は利用できません",
        ToastStatus.WARNING
      );
      return;
    }

    if (!navigator.serviceWorker.controller) {
      await navigator.serviceWorker.register("/service-worker.js");
    }

    const registration = await navigator.serviceWorker.ready;

    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) {
      return;
    }

    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    await POST<string, PushSubscriptionPayload>(
      "/api/v1/push_notifications/push_subscriptions",
      newSubscription
    );
  } catch (error: unknown) {
    console.error("Push registration failed:", error);
  }
}
