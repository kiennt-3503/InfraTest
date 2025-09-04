module V1
  module ChatRooms
    class Detail < Grape::API
      desc "Get chat room details"
      params do
        requires :chat_room_id, type: Integer, desc: "ID of the chat room"
      end

      get ':chat_room_id/detail' do
        chat_room = ChatRoom.find_by(id: params[:chat_room_id])
        error!({ message: I18n.t('shared.messages.not_found') }, 404) unless chat_room

        current_user_has_joined = chat_room.users.exists?(current_user.id)

        members = chat_room.users.select(:id, :username)

        options = {
          current_user: current_user,
          current_user_has_joined: current_user_has_joined,
          members: members,
          show_members: true
        }

        present_response(
          data_payload: chat_room,
          data_entity: Entities::ChatRooms::ChatRoom,
          message: I18n.t('chat_rooms.fetch_detail_success'),
          options: options
        )
      rescue StandardError => e
        error!({ message: I18n.t('shared.messages.internal_server_error'), detail: e.message }, 500)
      end
    end
  end
end
