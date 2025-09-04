import { createMessage } from "@/apis/chat";
import { CreateMessageRequest, CreateMessageResponse } from "@/types/message";
import { useMutation } from "@tanstack/react-query";

export const usePostMessage = () => {
  return useMutation<CreateMessageResponse, Error, CreateMessageRequest>({
    mutationFn: (variables: CreateMessageRequest) =>
      createMessage(
        variables.receiver_id,
        variables.content,
        variables.message_type,
        variables.chat_room_id
      ),
  });
};
