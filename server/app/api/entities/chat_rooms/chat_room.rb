module Entities
  module ChatRooms
    class ChatRoom < Grape::Entity
      expose :id
      expose :room_name
      expose :room_type
      expose :chatroom_location_type
      expose :coordinates do |chat_room, _options|
        {
          lat: chat_room.latitude,
          lng: chat_room.longitude
        }
      end

      expose :members_count
      expose :current_user_has_joined do |chat_room, options|
        options[:current_user_has_joined] || false
      end

      expose :unread_messages_count, if: ->(_, options) { options[:show_unread_count] } do |chat_room, options|
        unread_counts = options[:unread_counts] || {}
        unread_counts[chat_room.id] || 0
      end

      expose :last_message, if: ->(_, options) { options[:last_messages].present? } do |chat_room, options|
        last_message = options[:last_messages][chat_room.id]
        if last_message
          {
            content: last_message.content,
            created_at: last_message.created_at,
          }
        end
      end

      expose :chat_room_members, if: ->(_, options) { options[:chat_room_members].present? } do |chat_room, options|
        members = options[:chat_room_members][chat_room.id.to_i] || []
        members.map do |member|
          {
            id: member[:id],
            username: member[:username],
          }
        end
      end

      expose :members, if: ->(_, options) { options[:show_members] } do |chat_room, options|
        members = options[:members] || chat_room.users.select(:id, :username)
        members.map do |member|
          {
            id: member.id,
            username: member.username
          }
        end
      end

      expose :updated_at do |room, options|
        updated_ats = options[:updated_ats]
        if updated_ats && updated_ats[room.id]
          updated_ats[room.id].iso8601
        else
          room.updated_at.iso8601
        end
      end
    end
  end
end
