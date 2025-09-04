class TrainLineStation < ApplicationRecord
  belongs_to :train_line
  belongs_to :station
end
