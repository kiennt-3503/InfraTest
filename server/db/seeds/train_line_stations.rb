require 'csv'

csv_path = Rails.root.join('db/data/TrainLineStations.csv')
ActiveRecord::Base.connection.reset_pk_sequence!('train_line_stations')

TrainLineStation.delete_all

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  line = TrainLine.find_by(id: row["Line ID"])
  station = Station.find_by(id: row["Station ID"])

  TrainLineStation.create!(
    train_line: line,
    station: station,
  )
end

puts "✅ Done. Seeded #{TrainLineStation.count} train line stations."
