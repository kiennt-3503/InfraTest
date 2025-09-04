class RemoveLatAndLonInLineCompany < ActiveRecord::Migration[7.1]
  def change
    remove_column :line_companies, :latitude, :float
    remove_column :line_companies, :longitude, :float
  end
end
