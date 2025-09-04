class CreateAddresses < ActiveRecord::Migration[7.1]
  def change
    create_table :addresses do |t|
      t.string :address_line
      t.float :latitude
      t.float :longitude
      t.string :building_name
      t.string :floor
      t.string :note
      t.references :district, null: false, foreign_key: true
      t.references :town, null: false, foreign_key: true

      t.timestamps
    end
  end
end
