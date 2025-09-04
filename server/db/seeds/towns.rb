require 'csv'

csv_path = Rails.root.join('db/data/Townsv2.csv')

Town.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('towns')

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  # district = District.find_by(district_name: row["District"])
  district = District.find_by(id: row["district_id"].to_i)

  Town.create!(
    town_name: row["town_name"],
    latitude: row["latitude"],
    longitude: row["longitude"],
    district: district,
    postalCode: row["postalCode"]
    # postalCode: row["PostalCode"].to_s.rjust(7, '0')
  )
end

puts "✅ Done. Seeded #{Town.count} towns."
