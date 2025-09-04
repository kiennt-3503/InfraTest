# app/channels/chat_room_channel.rb
class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    # binding.pry
    Rails.logger.debug "Auth Header String: #{current_user}"

    reject unless current_user # Yêu cầu xác thực
    @chat_room = ChatRoom.find_by(id: params[:room_id])
    reject unless @chat_room
    stream_from "chat_room_#{@chat_room.id}"
    puts "[ActionCable] User #{current_user.id} subscribed to chat_room_#{@chat_room.id}"
  end

  def unsubscribed
    puts "[ActionCable] User #{current_user.id} unsubscribed from chat_room_#{@chat_room.id}" if @chat_room
  end

  def send_message(data)
    return unless current_user && @chat_room

    begin
      message = @chat_room.messages.create!(
        content: data['content'],
        user: current_user
      )

      ActionCable.server.broadcast(
        "chat_room_#{@chat_room.id}",
        {
          id: message.id,
          content: message.content,
          created_at: message.created_at,
          username: message.user.username,
          # is_sender: message.user.id == current_user.id,
          message_type: 'text',
          sender: {
            id: message.user.id,
            username: message.user.username,
          }
        }
      )


      @chat_room.users.each do |user|
        unread_count = 0

        chat_room_member = ChatRoomMember.find_by(user_id: user.id, chat_room_id: @chat_room.id)

        if user.id == current_user.id
          chat_room_member.update!(
            last_read_message_id: message.id,
            last_read_at: Time.current
          )
          unread_count = 0
        else
          last_read_id = chat_room_member&.last_read_message_id || 0
          unread_count = @chat_room.messages.where("id > ?", last_read_id).count
        end

        ActionCable.server.broadcast(
          "chat_rooms_list_user_#{user.id}",
          {
            chat_room_id: @chat_room.id,
            room_name: @chat_room.room_name,
            last_message: message,
            updated_at: message.created_at.iso8601,
            sender_name: message.user.username,
            unread_messages_count: unread_count,
            members_count: @chat_room.users.count,
            members: @chat_room.users.select(:id, :username),
            show_members: true
          }
        )
      end

      Rails.logger.info "[ActionCable] Message broadcasted: '#{message.content}'"
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "[ActionCable Error] Message validation failed: #{e.message}"
    rescue => e
      Rails.logger.error "[ActionCable Error] Failed to send message: #{e.message}"
    end
  end
end
