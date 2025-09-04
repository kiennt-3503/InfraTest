class TrainLine < ApplicationRecord
  has_many :train_line_stations, foreign_key: :line_id, dependent: :destroy, inverse_of: :train_line
  has_many :stations, through: :train_line_stations
  belongs_to :operator, class_name: "LineCompany"
end
