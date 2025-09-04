class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chat_room

  enum :message_type, {text: 1, image: 2, file: 3}

  validates :content, presence: true
  encrypts :content, deterministic: true

  def soft_delete
    update(deleted_at: Time.current)
  end

  def deleted?
    deleted_at.present?
  end
end
