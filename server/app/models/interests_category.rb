class InterestsCategory < ApplicationRecord
  has_many :interests, foreign_key: :interest_category_id, inverse_of: :interests_category, dependent: :destroy
end
