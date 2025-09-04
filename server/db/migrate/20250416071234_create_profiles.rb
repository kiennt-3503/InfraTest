class CreateProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :profiles, id: false do |t|
      t.references :user, null: false, foreign_key: true, primary_key: true
      t.text :bio
      t.integer :gender
      t.date :birthday
      t.integer :mbti
      t.integer :zodiac
      t.text :language_proficiency
      t.string :profile_picture_url
    end
  end
end
