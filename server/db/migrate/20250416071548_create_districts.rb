class CreateDistricts < ActiveRecord::Migration[7.1]
  def change
    create_table :districts do |t|
      t.integer :section_id
      t.string :district_name
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
