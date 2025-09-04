import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markChatRoomAsRead } from "@/apis/chat";

export function useMarkChatRoomAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatRoomId: number) => markChatRoomAsRead(chatRoomId),
    onSuccess: (_data, chatRoomId) => {
      // Refetch danh sách phòng chat để cập nhật unread_count
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      // Có thể thêm cập nhật chi tiết phòng chat nếu cần:
      queryClient.invalidateQueries({
        queryKey: ["chatRoomDetail", chatRoomId],
      });
    },
  });
}
