module V1
  module ChatRooms
    class Base < V1::Base
      helpers V1::Base.helpers

      before { authenticate! }

      resource :chat_rooms do
        mount V1::ChatRooms::ByArea
        mount V1::ChatRooms::Create
        mount V1::ChatRooms::AutoJoinByLocation
        mount V1::ChatRooms::Join
        mount V1::ChatRooms::ByUser
        mount V1::ChatRooms::Leave
        mount V1::ChatRooms::MarkRead
        mount V1::ChatRooms::Detail
        mount V1::ChatRooms::Create
      end
    end
  end
end
