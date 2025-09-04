class CreateInterestsCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :interests_categories do |t|
      t.string :category_name

      t.timestamps
    end
  end
end
