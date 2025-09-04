class Interest < ApplicationRecord
  belongs_to :interests_category, foreign_key: :interest_category_id, inverse_of: :interests
  has_many :user_interests, dependent: :destroy
  has_many :users, through: :user_interests
end
