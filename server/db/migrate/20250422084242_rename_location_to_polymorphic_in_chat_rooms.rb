class RenameLocationToPolymorphicInChatRooms < ActiveRecord::Migration[7.1]
  def change
    rename_column :chat_rooms, :location_id, :chatroom_location_id
    rename_column :chat_rooms, :location_type, :chatroom_location_type
    change_column :chat_rooms, :chatroom_location_type, :string
  end
end
