class CreateInterests < ActiveRecord::Migration[7.1]
  def change
    create_table :interests do |t|
      t.references :category, null: false, foreign_key: { to_table: :interests_categories }
      t.string :interest_name
      t.boolean :custom_interest

      t.timestamps
    end
  end
end
