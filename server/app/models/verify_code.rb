class VerifyCode < ApplicationRecord
  scope :valid_code, ->(code) { where('code = ? AND (expired_at IS NULL OR expired_at > ?)', code, Time.current) }
  scope :current_code, -> { where('expired_at IS NULL OR expired_at > ?', Time.current).last }
end
