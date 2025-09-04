class UpdateStationLinesColumns < ActiveRecord::Migration[7.1]
  def change
    add_column :train_lines, :name_K, :string
    add_column :train_lines, :name_H, :string
    add_column :train_lines, :latitude, :float
    add_column :train_lines, :longitude, :float
  end
end
