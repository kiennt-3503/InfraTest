class Section < ApplicationRecord
  belongs_to :prefecture
  has_many :districts, dependent: :destroy
end
