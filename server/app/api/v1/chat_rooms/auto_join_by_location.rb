module V1
  module ChatRooms
    class AutoJoinByLocation < Grape::API
      desc "Auto join user to chat rooms based on user location"
      post :auto_join_by_location do
        current_user.user_locations.find_each do |user_location_record|
          location = user_location_record.user_location

          case user_location_record.user_location_type
          when 'Station'
            chat_room = ChatRoom.find_by(chatroom_location: location, room_type: :group)
          
            if chat_room && !chat_room.chat_room_members.exists?(user_id: current_user.id)
              chat_room.chat_room_members.create!(user_id: current_user.id)
              PushNotificationService.send_new_member_notification(chat_room: chat_room, new_user: current_user)
            end
          # when 'Address'
          #   ChatRoom.find_by(chatroom_location: location.district, room_type: :group)&.add_user_if_not_exists(current_user) if location.district
          #   ChatRoom.find_by(chatroom_location: location.town, room_type: :group)&.add_user_if_not_exists(current_user) if location.town
          end
        end

        { status: "success", message: "Current user joined all matching chat rooms based on location." }
      rescue StandardError => e
        error!({ message: e.message }, 400)
      end
    end
  end
end
