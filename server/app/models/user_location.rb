class UserLocation < ApplicationRecord
  belongs_to :user
  belongs_to :user_location, polymorphic: true
end
