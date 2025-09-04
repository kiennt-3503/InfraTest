class CreateUserLocations < ActiveRecord::Migration[7.1]
  def change
    create_table :user_locations do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :location_type
      t.integer :location_id

      t.timestamps
    end
  end
end
