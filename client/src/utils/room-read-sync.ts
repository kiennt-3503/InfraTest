// src/utils/room-read-sync.ts

export const ROOM_READ_KEY = 'ROOM_READ_STATUS';

type RoomReadStatus = Record<string, boolean>; // { roomId: true/false }

export const getRoomReadStatus = (): RoomReadStatus => {
  try {
    const data = localStorage.getItem(ROOM_READ_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const setRoomRead = (roomId: string, isRead: boolean) => {
  const current = getRoomReadStatus();

  // Nếu không có thay đổi gì thì bỏ qua
  if (current[roomId] === isRead) return;

  const updated = { ...current, [roomId]: isRead };
  localStorage.setItem(ROOM_READ_KEY, JSON.stringify(updated));
};

export const onRoomReadStatusChange = (callback: (updatedStatus: RoomReadStatus) => void) => {
  const listener = (e: StorageEvent) => {
    if (e.key === ROOM_READ_KEY && e.newValue) {
      try {
        const updated = JSON.parse(e.newValue);
        callback(updated);
      } catch {
        // invalid JSON, ignore
      }
    }
  };
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
};
