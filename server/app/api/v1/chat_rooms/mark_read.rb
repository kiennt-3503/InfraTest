module V1
  module ChatRooms
    class MarkRead < Grape::API
      desc I18n.t("chat_rooms.mark_read.desc")
      params do
        requires :chat_room_id, type: Integer, desc: 'ID of the chat room'
      end
      put '/:chat_room_id/mark_read' do
        chat_room = ChatRoom.find_by(id: params[:chat_room_id])
        error!({ message: I18n.t('chat_rooms.not_found') }, 404) unless chat_room

        chat_room_member = chat_room.chat_room_members.find_by(user_id: current_user.id)
        error!({ message: I18n.t('chat_rooms.unauthorized_access') }, 403) unless chat_room_member

        last_message = chat_room.messages.order(created_at: :desc).first
        if last_message.nil?
          present_response(message: I18n.t('chat_rooms.no_messages'), data_payload: nil)
        else
          chat_room_member.update!(
            last_read_message_id: last_message.id,
            last_read_at: Time.current
          )

          present_response(
            message: I18n.t('chat_rooms.mark_read.marked_as_read_successfully'),
            data_payload: { last_read_message_id: last_message.id }
          )
        end
      rescue StandardError => e
        error!({ message: I18n.t('shared.messages.internal_server_error'), detail: e.message }, 500)
      end
    end
  end
end
