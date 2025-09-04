import { useMutation, useQuery } from "@tanstack/react-query";
import { getChatroomDetail, joinChatroom } from "@/apis/chatroom";
import { useToast } from "./useToast";

interface UseChatroomDetailProps {
  chatroomId: string | null;
}

export const useChatroomDetail = ({ chatroomId }: UseChatroomDetailProps) => {
  const { showToast } = useToast();

  const {
    data: chatroom,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chatroomDetail", chatroomId],
    queryFn: () => getChatroomDetail(chatroomId!),
    enabled: !!chatroomId,
  });

  const joinChatroomMutation = useMutation({
    mutationFn: ({
      chatroomId,
      message,
    }: {
      chatroomId: string;
      message: string;
    }) => joinChatroom(chatroomId, message),
    onSuccess: () => {
      showToast("チャットルームに参加しました！", "success");
      // Refetch to get updated data
      refetch();
    },
    onError: () => {
      showToast(
        "チャットルームへの参加に失敗しました。再度お試しください。",
        "error"
      );
    },
  });

  const handleJoinChatroom = (chatroomId: string, message: string) => {
    joinChatroomMutation.mutate({ chatroomId, message });
  };

  return {
    chatroom,
    loading,
    error: error?.message || null,
    refetch,
    handleJoinChatroom,
    isJoining: joinChatroomMutation.isPending,
    joinSuccess: joinChatroomMutation.isSuccess,
    joinedChatroom: joinChatroomMutation.data,
  };
};
