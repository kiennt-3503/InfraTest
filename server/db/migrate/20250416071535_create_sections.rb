class CreateSections < ActiveRecord::Migration[7.1]
  def change
    create_table :sections do |t|
      t.integer :prefecture_id
      t.string :section_name
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
