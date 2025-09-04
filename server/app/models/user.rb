class User < ApplicationRecord
  has_secure_password

  # Associations
  has_one :profile, dependent: :destroy
  has_many :user_locations, dependent: :destroy
  has_many :chat_room_members, dependent: :destroy
  has_many :chat_rooms, through: :chat_room_members
  has_many :messages, dependent: :destroy
  has_many :user_interests, dependent: :destroy
  has_many :interests, through: :user_interests
  has_many :push_subscriptions, dependent: :destroy

  # Validations
  validates :username, presence: true, uniqueness: true
  validates :email,
          uniqueness: { allow_nil: true },
          format: { with: URI::MailTo::EMAIL_REGEXP, message: "không hợp lệ", allow_nil: true }

  # Scopes
  scope :by_username, ->(username) { where("LOWER(username) = ?", username.downcase).first }
end
