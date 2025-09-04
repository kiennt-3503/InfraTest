# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
TrainLineStation.delete_all
TrainLine.delete_all
LineCompany.delete_all
Station.delete_all
Town.delete_all
District.delete_all
Section.delete_all
Prefecture.delete_all
Region.delete_all
ChatRoomMember.delete_all
ChatRoom.delete_all
User.delete_all
VerifyCode.delete_all

# Seed users
5.times do |i|
  User.create(
    username: "testuser#{i + 1}",
    password: "Testuser#{i + 1}@",
    email: "testemail#{i + 1}@gmail.com"
  )
end
puts "✅ Done. Seeded #{User.count} users."

load Rails.root.join('db/seeds/regions.rb')
load Rails.root.join('db/seeds/prefectures.rb')
load Rails.root.join('db/seeds/sections.rb')
load Rails.root.join('db/seeds/districts.rb')
load Rails.root.join('db/seeds/towns.rb')
load Rails.root.join('db/seeds/stations.rb')
load Rails.root.join('db/seeds/line_companies.rb')
load Rails.root.join('db/seeds/lines.rb')
load Rails.root.join('db/seeds/train_line_stations.rb')
load Rails.root.join('db/seeds/chat_rooms.rb')
load Rails.root.join('db/seeds/chat_room_members.rb')

# Seed verify code
VerifyCode.create(code: "abc123", link: "https://sun-jp.slack.com/archives/C08GRHS2PGW/p1747148950027689")
puts "Seeding verify codes done"
