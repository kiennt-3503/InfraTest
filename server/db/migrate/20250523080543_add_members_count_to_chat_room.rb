class AddMembersCountToChatRoom < ActiveRecord::Migration[7.1]
  def change
    add_column :chat_rooms, :members_count, :integer, default: 0, null: false
  end
end
