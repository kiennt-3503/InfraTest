require 'csv'

csv_path = Rails.root.join('db/data/Stations.csv')
ActiveRecord::Base.connection.reset_pk_sequence!('stations')

Station.delete_all

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  prefecture = Prefecture.find_by(id: row["Prefecture ID"].to_i)

  Station.create!(
    id: row["ID"],
    prefecture: prefecture,
    station_name: row["Name"],
    station_code: row["Secure ID"],
    latitude: row["Lat"].gsub(/[^\d\.\-]/, '').to_f,
    longitude: row["Lon"].gsub(/[^\d\.\-]/, '').to_f,
    address: row["Address"],
    post: row["Post"]
  )
end

puts "✅ Done. Seeded #{Station.count} stations."
