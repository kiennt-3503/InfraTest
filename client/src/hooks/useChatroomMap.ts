import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { BoundsCoordinates } from "@/types/googlemap";
import { ChatRoomMap } from "@/types/chatroom";
import { getChatroomMap } from "@/apis/chatroom";
import { useDebounce } from "./useDebounce";

export const useChatroomMap = ({
  bounds,
  zoom,
}: {
  bounds?: BoundsCoordinates;
  zoom?: number;
}) => {
  const [chatRoomMaps, setChatRoomMaps] = useState<ChatRoomMap[]>([]);

  // Use the debounce hook to debounce the bounds and zoom values
  const debouncedBounds = useDebounce(bounds, 300);
  const debouncedZoom = useDebounce(zoom, 300);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!debouncedBounds || debouncedZoom === undefined) return [];

      return getChatroomMap(
        debouncedBounds.ne,
        debouncedBounds.sw,
        debouncedZoom
      );
    },
    onSuccess: (data) => {
      setChatRoomMaps(Array.isArray(data) ? (data as ChatRoomMap[]) : []);
    },
  });

  useEffect(() => {
    if (debouncedBounds && debouncedZoom) {
      mutation.mutate();
    }
  }, [debouncedBounds, debouncedZoom]);

  return {
    chatRoomMaps,
  };
};
