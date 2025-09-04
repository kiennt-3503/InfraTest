module V1
  module ChatRooms
    class ByUser < Grape::API
      desc "Get the list of chat rooms the user has joined"
      params do
        requires :user_id, type: Integer, desc: "ID of the user"
      end
      get ':user_id/by_user' do
        error!({ message: I18n.t("chat_rooms.not_permission"), data: nil }, 403) if current_user.id != params[:user_id].to_i

        chat_rooms = current_user.chat_rooms.includes(:messages)

        if chat_rooms.any?
          last_reads = ChatRoomMember
                        .where(user_id: current_user.id, chat_room_id: chat_rooms.map(&:id))
                        .pluck(:chat_room_id, :last_read_message_id)
                        .to_h

          unread_counts = {}
          last_messages = {}
          updated_ats = {}
          chat_room_members = {}

          chat_rooms.each do |room|
            last_read_id = last_reads[room.id] || 0
            unread_counts[room.id] = room.messages.where("id > ?", last_read_id).count

            last_message = room.messages.order(created_at: :desc).first
            last_messages[room.id] = last_message
            updated_ats[room.id] = last_message&.created_at || room.updated_at

            chat_room_members[room.id.to_i] = room.users.map do |user|
              {
                id: user.id,
                username: user.username,
              }
            end
          end

          present_response(
            data_payload: chat_rooms,
            data_entity: Entities::ChatRooms::ChatRoom,
            message: I18n.t("chat_rooms.fetch_rooms_by_user"),
            options: {
              current_user: current_user,
              show_unread_count: true,
              unread_counts: unread_counts,
              last_messages: last_messages,
              updated_ats: updated_ats,
              chat_room_members: chat_room_members,
            }
          )
        else
          { message: I18n.t("chat_rooms.not_join"), data: [] }
        end
      end

      desc "Get list of usernames in a chat room"
      params do
        requires :chat_room_id, type: Integer, desc: "Chat Room ID"
      end
      get ':chat_room_id/members' do
        chat_room = ChatRoom.find_by(id: params[:chat_room_id])
        error!({ message: I18n.t("chat_rooms.not_found"), data: nil }, 404) unless chat_room
        error!({ message: I18n.t("chat_rooms.not_permission"), data: nil }, 403) unless chat_room.users.exists?(current_user.id)

        usernames = chat_room.users.pluck(:username)

        {
          message: I18n.t("chat_rooms.fetch_members_success"),
          data: usernames
        }
      end
    end
  end
end
