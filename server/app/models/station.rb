class Station < ApplicationRecord
  geocoded_by :coordinates

  belongs_to :prefecture
  has_many :train_line_stations, dependent: :destroy
  has_many :train_lines, through: :train_line_stations
  has_many :user_locations, as: :user_location, dependent: :destroy
  has_one :chat_room, as: :chatroom_location, dependent: :destroy, inverse_of: :chatroom_location
end
