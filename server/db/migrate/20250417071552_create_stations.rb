class CreateStations < ActiveRecord::Migration[7.1]
  def change
    create_table :stations do |t|
      t.references :prefecture, null: false, foreign_key: true
      t.string :station_name
      t.string :station_kana
      t.string :station_code
      t.float :latitude
      t.float :longitude
      t.boolean :is_major

      t.timestamps
    end
  end
end
