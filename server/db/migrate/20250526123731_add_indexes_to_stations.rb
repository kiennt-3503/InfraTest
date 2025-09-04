class AddIndexesToStations < ActiveRecord::Migration[7.1]
  def change
    add_index :stations, :post
    add_index :stations, [:prefecture_id, :post]
  end
end
