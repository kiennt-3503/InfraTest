class JoinLocationService
  class << self
    def perform(current_user, locations, location_type, is_live: false)
      UserLocation.transaction do
        locations.map do |location|
          create_user_location_and_join_chatroom(current_user, location, location_type, is_live)
        end
      end
    end

    private

    def create_user_location_and_join_chatroom(current_user, location, location_type, is_live)
      # Create user_location
      user_location = UserLocation.create!(
        user_id: current_user.id,
        user_location_type: location_type,
        user_location_id: location.id,
        is_live: is_live,
        user_location: location
      )

      chatroom = ChatRoom.find_by!(
        chatroom_location_type: location_type,
        chatroom_location_id: location.id,
        room_type: :group
      )

      was_member = chatroom.chat_room_members.exists?(user_id: current_user.id)

      unless was_member
        chatroom.add_user_if_not_exists(current_user)
        PushNotificationService.send_new_member_notification(chat_room: chatroom, new_user: current_user)
      end

      user_location
    end
  end
end
