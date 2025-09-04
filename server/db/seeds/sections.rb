require 'csv'

csv_path = Rails.root.join('db/data/Sections.csv')

Section.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('sections')

CSV.foreach(csv_path, headers: true, encoding: "UTF-8") do |row|
  prefecture = Prefecture.find_by(id: row["Prefecture ID"].to_i)

  Section.create!(
    id: row["ID"],
    prefecture: prefecture,
    section_name: row["Name"]
  )
end

puts "✅ Done. Seeded #{Section.count} sections."
