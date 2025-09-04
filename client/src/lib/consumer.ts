// src/lib/actioncable/consumer.ts
import { createConsumer } from "@rails/actioncable";

function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

const createActionCableConsumer = () => {
  const token = getAuthToken();
  const baseUrl = "ws://localhost:3001/cable";

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_ACTION_CABLE_URL is not defined!");
    return null;
  }

  // Gắn token vào query string của WebSocket URL
  const url = `${baseUrl}?token=${encodeURIComponent(token || "")}`;

  return createConsumer(url);
};

const consumer = createActionCableConsumer();
export default consumer;
