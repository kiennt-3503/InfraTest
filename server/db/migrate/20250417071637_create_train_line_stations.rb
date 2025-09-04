class CreateTrainLineStations < ActiveRecord::Migration[7.1]
  def change
    create_table :train_line_stations do |t|
      t.references :train_line, null: false, foreign_key: true
      t.references :station, null: false, foreign_key: true
      t.integer :station_order

      t.timestamps
    end
  end
end
