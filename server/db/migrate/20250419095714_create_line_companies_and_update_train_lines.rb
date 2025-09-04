class CreateLineCompaniesAndUpdateTrainLines < ActiveRecord::Migration[7.1]
  def change
    create_table :line_companies do |t|
      t.string :name
      t.string :name_K
      t.string :name_H
      t.string :name_R
      t.string :url
      t.float :latitude
      t.float :longitude

      t.timestamps
      
    end

    add_reference :train_lines, :operator, foreign_key: { to_table: :line_companies }
  end
end
