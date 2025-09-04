require 'csv'

csv_path = Rails.root.join('db/data/LineCompanies.csv')

LineCompany.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('line_companies')

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  LineCompany.create!(
    id: row["ID"],
    name: row["Name"],
    name_K: row["Name K"],
    name_H: row["Name H"],
    name_R: row["Name R"],
    url: row["URL"],
  )
end

puts "✅ Done. Seeded #{Station.count} line companies."
