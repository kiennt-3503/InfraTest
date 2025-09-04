class CreateChatRoomMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_room_members do |t|
      t.references :chat_room, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :joined_at

      t.timestamps
    end
  end
end
