class CreateChatRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_rooms do |t|
      t.string :room_name
      t.integer :room_type
      t.integer :location_type
      t.integer :location_id

      t.timestamps
    end
  end
end
