class CreateTrainLines < ActiveRecord::Migration[7.1]
  def change
    create_table :train_lines do |t|
      t.string :line_name
      t.string :operator
      t.string :color

      t.timestamps
    end
  end
end
