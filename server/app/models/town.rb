class Town < ApplicationRecord
  geocoded_by :coordinates

  belongs_to :district
  has_many :addresses, dependent: :destroy
  has_one :chat_room, as: :chatroom_location, dependent: :destroy
end
