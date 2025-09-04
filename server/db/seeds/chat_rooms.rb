created_rooms = []

# Create ChatRoom for each District
District.find_each do |district|
  next if ChatRoom.exists?(chatroom_location: district, room_type: :group)

  chat_room = ChatRoom.create!(
    chatroom_location: district,
    room_type: :group,
    room_name: "#{district.district_name}"
  )
  created_rooms << chat_room
end

# Create ChatRoom for each Town
Town.find_each do |town|
  next if ChatRoom.exists?(chatroom_location: town, room_type: :group)

  chat_room = ChatRoom.create!(
    chatroom_location: town,
    room_type: :group,
    room_name: "#{town.town_name}"
  )
  created_rooms << chat_room
end

# Create ChatRoom for each Station
Station.find_each do |station|
  next if ChatRoom.exists?(chatroom_location: station, room_type: :group)

  chat_room = ChatRoom.create!(
    chatroom_location: station,
    room_type: :group,
    room_name: "#{station.station_name}"
  )
  created_rooms << chat_room
end

puts "✅ Done. Seeded #{created_rooms.count} chatrooms."
