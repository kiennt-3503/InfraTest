module V1
  module ChatRooms
    class Leave < Grape::API
      desc "Leave a chat room"
      params do
        requires :chat_room_id, type: Integer, desc: "ID of the chat room to leave"
      end

      delete ":chat_room_id/leave" do
        chat_room = ChatRoom.find_by(id: params[:chat_room_id])
        error!({ message: I18n.t("shared.messages.not_found") }, 404) unless chat_room

        member = chat_room.chat_room_members.find_by(user_id: current_user.id)
        error!({ message: I18n.t("chat_rooms.member_not_found") }, 404) unless member

        member.destroy!

        present_response(
          data_payload: chat_room,
          data_entity: Entities::ChatRooms::ChatRoom,
          message: I18n.t("chat_rooms.left_success")
        )
      rescue ActiveRecord::RecordInvalid => e
        error!({ message: e.record.errors.full_messages.join(", ") }, 422)
      rescue StandardError => e
        error!({ message: I18n.t("shared.messages.internal_server_error"), detail: e.message }, 500)
      end
    end
  end
end
