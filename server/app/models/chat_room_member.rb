class ChatRoomMember < ApplicationRecord
  belongs_to :chat_room, counter_cache: :members_count
  belongs_to :user
end
