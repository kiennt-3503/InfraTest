class Address < ApplicationRecord
  belongs_to :district
  belongs_to :town
  has_many :user_locations, as: :user_location, dependent: :destroy
  has_many :chat_rooms, as: :chatroom_location, dependent: :destroy
  validates :latitude, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :longitude, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
end
