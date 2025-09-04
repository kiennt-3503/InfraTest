Region.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('regions')

regions = [
  "北海道",
  "東北",
  "関東",
  "甲信越・北陸",
  "東海",
  "近畿",
  "中国",
  "四国",
  "九州",
]

regions.each do |region_name|
  Region.create!(region_name: region_name)
end

puts "✅ Seeded #{Region.count} regions!"
