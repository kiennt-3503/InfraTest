class ChatRoom < ApplicationRecord
  VALID_LOCATION_TYPES = %w[District Town Station].freeze

  belongs_to :chatroom_location, polymorphic: true
  has_many :chat_room_members, dependent: :destroy
  has_many :users, through: :chat_room_members
  has_many :messages, dependent: :destroy

  enum :room_type, {group: 1, direct: 2}, prefix: true
  # delegate :latitude, :longitude, to: :chatroom_location, allow_nil: true

  scope :has_member, -> { where.not(members_count: 0) }
  scope :by_location_types, ->(location_types) { where(chatroom_location_type: location_types) }
  scope :by_location_ids, ->(location_ids) { where(chatroom_location_id: location_ids) }

  def add_user_if_not_exists(user)
    member = chat_room_members.find_or_initialize_by(user: user)
    if member.new_record?
      member.joined_at = Time.current
      member.save
    end
    member
  end

  class << self
    def valid_location_type?(type)
      VALID_LOCATION_TYPES.include?(type)
    end
  end

  def joinable?
    room_type_group? && ChatRoom.valid_location_type?(chatroom_location_type)
  end

  def latitude
    return nil if chatroom_location_type == 'User'

    chatroom_location&.latitude
  end

  def longitude
    return nil if chatroom_location_type == 'User'

    chatroom_location&.longitude
  end
end
