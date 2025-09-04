require 'csv'

csv_path = Rails.root.join('db/data/Lines.csv')

TrainLine.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('train_lines')

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  operator = LineCompany.find_by(id: row["Line Company ID"].to_i)

  TrainLine.create!(
    id: row["ID"],
    operator: operator,
    line_name: row["Name"],
    name_K: row["name_K"],
    name_H: row["name_H"],
    color: row["Color C"],
    latitude: row["Lat"].gsub(/[^\d\.\-]/, '').to_f,
    longitude: row["Lon"].gsub(/[^\d\.\-]/, '').to_f,
  )
end

puts "✅ Done. Seeded #{TrainLine.count} train lines."
