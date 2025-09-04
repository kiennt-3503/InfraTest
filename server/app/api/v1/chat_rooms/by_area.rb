# app/api/v1/chat_rooms/by_area.rb
module V1
  module ChatRooms
    class ByArea < Grape::API
      desc I18n.t("chat_rooms.by_area.desc"), {
        success: [
          { code: 200, model: Entities::ChatRooms::ChatRoom, message: I18n.t("sessions.login.success") }
        ],
        failure: [
          { code: 404, model: Entities::Errors::NotFoundError, message: I18n.t("shared.messages.not_found") },
          { code: 500, model: Entities::Errors::InternalServerError, message: I18n.t("shared.messages.internal_server_error") }
        ]
      }
      params do
        requires :south_west_lng, type: Float
        requires :south_west_lat, type: Float
        requires :north_east_lng, type: Float
        requires :north_east_lat, type: Float
        requires :zoom, type: Integer
      end

      get :by_area do
        zoom = params[:zoom]
        return present_response data_payload: [], data_entity: Entities::ChatRooms::ChatRoom, message: I18n.t("chat_rooms.by_area.zoom_too_low") if zoom < 6

        models = [District, Town, Station]
        sw_corner = [params[:south_west_lat], params[:south_west_lng]]
        ne_corner = [params[:north_east_lat], params[:north_east_lng]]
        location_records = models.flat_map do |model|
          model.within_bounding_box(sw_corner, ne_corner)
        end

        location_types = models.map(&:name)
        location_ids = location_records.pluck(:id)

        chat_rooms = ChatRoom.preload(:chatroom_location)
                             .by_location_types(location_types)
                             .by_location_ids(location_ids)
                             .has_member

        present_response data_payload: chat_rooms, data_entity: Entities::ChatRooms::ChatRoom
      end
    end
  end
end
