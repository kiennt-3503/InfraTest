require 'csv'

csv_path = Rails.root.join('db/data/Districts.csv')

District.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('districts')

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  section = Section.find_by(id: row["section_id"].to_i)

  District.create!(
    district_name: row["district_name"],
    latitude: row["latitude"],
    longitude: row["longitude"],
    section: section
  )
end

puts "✅ Done. Seeded #{District.count} districts."
