class CreateTowns < ActiveRecord::Migration[7.1]
  def change
    create_table :towns do |t|
      t.integer :district_id
      t.string :town_name
      t.float :latitude
      t.float :longitude
      t.string :postalCode

      t.timestamps
    end
  end
end
