class ChatRoomsListChannel < ApplicationCable::Channel
  def subscribed
    reject unless current_user
    stream_from "chat_rooms_list_user_#{current_user.id}"
  end

  def unsubscribed
    puts "[ActionCable] User #{current_user.id} unsubscribed from chat_rooms_list_user_#{@chat_room.id}" if @chat_room
  end
end
