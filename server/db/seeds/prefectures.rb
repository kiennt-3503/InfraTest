require 'csv'

csv_path = Rails.root.join('db/data/Prefectures.csv')

Prefecture.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('prefectures')

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  region = Region.find_by(id: row["Area"].to_i)

  Prefecture.create!(
    prefecture_name: row["Name"],
    region: region
  )
end

puts "✅ Done. Seeded #{Prefecture.count} prefectures."
