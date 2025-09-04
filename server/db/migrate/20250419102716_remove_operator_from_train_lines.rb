class RemoveOperatorFromTrainLines < ActiveRecord::Migration[7.1]
  def change
    remove_column :train_lines, :operator, :string
  end
end
