class UpdateStationsColumns < ActiveRecord::Migration[6.1]
  def change
    remove_column :stations, :is_major, :boolean
    remove_column :stations, :station_kana, :string

    add_column :stations, :address, :string
    add_column :stations, :post, :string
  end
end
