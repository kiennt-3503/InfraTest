class RenameColumnsInUserLocations < ActiveRecord::Migration[7.1]
  def change
    rename_column :user_locations, :location_id, :user_location_id
    rename_column :user_locations, :location_type, :user_location_type
    change_column :user_locations, :user_location_type, :string
  end
end
