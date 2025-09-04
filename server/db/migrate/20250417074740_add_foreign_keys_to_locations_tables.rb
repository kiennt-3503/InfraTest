class AddForeignKeysToLocationsTables < ActiveRecord::Migration[7.1]
  def change
    change_column :districts, :section_id, :bigint
    add_foreign_key :districts, :sections, column: :section_id
    change_column :prefectures, :region_id, :bigint
    add_foreign_key :prefectures, :regions, column: :region_id
    change_column :sections, :prefecture_id, :bigint
    add_foreign_key :sections, :prefectures, column: :prefecture_id
    change_column :towns, :district_id, :bigint
    add_foreign_key :towns, :districts, column: :district_id
  end
end
