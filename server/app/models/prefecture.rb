class Prefecture < ApplicationRecord
  belongs_to :region
  has_many :sections, dependent: :destroy
  has_many :stations, dependent: :destroy
end
