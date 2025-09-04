class LineCompany < ApplicationRecord
  has_many :train_lines, foreign_key: :operator_id, dependent: :destroy, inverse_of: :line_company
end
