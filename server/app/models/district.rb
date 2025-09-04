class District < ApplicationRecord
  geocoded_by :coordinates

  belongs_to :section
  has_many :towns, dependent: :destroy
  has_many :addresses, dependent: :destroy
  has_one :chat_room, as: :chatroom_location, dependent: :destroy
end
