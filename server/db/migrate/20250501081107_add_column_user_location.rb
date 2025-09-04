class AddColumnUserLocation < ActiveRecord::Migration[7.1]
  def change
    add_column :user_locations, :is_live, :boolean, default: false
  end
end
