ChatRoomMember.delete_all

user = User.first

# Seed chat room members
sw_corner = [35.44457222312349, 139.27607640110966]
ne_corner = [35.55749050659997, 139.7951804050159]

stations = Station.within_bounding_box(sw_corner, ne_corner)
chat_rooms = ChatRoom.by_location_types([Station.name])
                     .by_location_ids(stations.pluck(:id))

chat_room_members = []
chat_rooms.each do |chat_room|
  chat_room_members << ChatRoomMember.create!(
    chat_room_id: chat_room.id,
    user_id: user.id,
    joined_at: Time.current
  )
end
puts "✅ Done. Seeded #{ChatRoomMember.count} chatroom members."
