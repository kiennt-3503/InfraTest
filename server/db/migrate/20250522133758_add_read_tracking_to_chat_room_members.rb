class AddReadTrackingToChatRoomMembers < ActiveRecord::Migration[7.1]
  def change
    add_column :chat_room_members, :last_read_message_id, :bigint
    add_column :chat_room_members, :last_read_at, :datetime

    add_index :chat_room_members, :last_read_message_id
  end
end
