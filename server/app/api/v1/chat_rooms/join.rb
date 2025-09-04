module V1
  module ChatRooms
    class Join < Grape::API
      desc "Join a chat room"
      params do
        requires :chat_room_id, type: Integer, desc: "ID of the chat room to join"
        requires :welcome_msg, type: String, desc: "Welcome message to send"
      end

      post ':chat_room_id/join' do
        chat_room = ChatRoom.find_by(id: params[:chat_room_id])
        error!({ message: I18n.t('shared.messages.not_found') }, 404) unless chat_room

        error!({ message: I18n.t('chat_rooms.not_joinable') }, 400) unless chat_room.joinable?
        error!({ message: I18n.t('chat_rooms.already_joined') }, 400) if chat_room.chat_room_members.exists?(user_id: current_user.id)

        chat_room.chat_room_members.create!(user_id: current_user.id)

        PushNotificationService.send_new_member_notification(chat_room: chat_room, new_user: current_user)

        present_response(
          data_payload: chat_room,
          data_entity: Entities::ChatRooms::ChatRoom,
          message: I18n.t('chat_rooms.joined_success'),
        )
      rescue ActiveRecord::RecordInvalid => e
        error!({ message: e.record.errors.full_messages.join(', ') }, 422)
      rescue StandardError => e
        error!({ message: I18n.t('shared.messages.internal_server_error'), detail: e.message }, 500)
      end
    end
  end
end
