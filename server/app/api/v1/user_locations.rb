module V1
  class UserLocations < V1::Base
    helpers V1::Base.helpers

    before { authenticate! }

    format :json
    prefix :api

    resource :user_locations do
      desc 'Create user location(s) from station(s)'
      params do
        requires :location_ids, type: Array[Integer]
        requires :location_type, type: String
        optional :is_live, type: Boolean
      end
      post :location do
        # Validate location type
        unless ChatRoom.valid_location_type?(params[:location_type])
          error!({ message: I18n.t('user_locations.invalid_location_type', type: params[:location_type]) }, 422)
        end

        # Validate locations exist
        location_class = params[:location_type].constantize
        locations = location_class.where(id: params[:location_ids])
        not_found = params[:location_ids] - locations.pluck(:id)

        if not_found.any?
          error!({ message: I18n.t('user_locations.not_found_entities', entity: params[:location_type], ids: not_found.join(', ')) }, 404)
        end

        begin
          JoinLocationService.perform(
            current_user,
            locations,
            params[:location_type],
            is_live: params[:is_live]
          )
          present_response(
            data_payload: nil,
            message: I18n.t('user_locations.created_successfully')
          )

        rescue ActiveRecord::RecordNotFound => e
          error!({ message: I18n.t('shared.messages.not_found', error: e.message) }, 404)
        rescue => e
          error!({ message: I18n.t('shared.messages.internal_server_error'), error: e.message }, 500)
        end
      end

      # # ---------- STATION: EDIT ----------
      # desc 'Update user station locations (replace all)'
      # params do
      #   requires :user_id, type: Integer
      #   requires :station_ids, type: Array[Integer]
      #   optional :is_live, type: Boolean
      # end
      # put :station do
      #   user = User.find_by(id: params[:user_id])
      #   error!({ message: I18n.t('user_locations.user_not_found') }, 404) unless user

      #   stations = Station.where(id: params[:station_ids])
      #   found_ids = stations.pluck(:id)
      #   not_found = params[:station_ids] - found_ids
      #   if not_found.any?
      #     error!({ message: I18n.t('user_locations.not_found_entities', entity: 'Station', ids: not_found.join(', ')) }, 404)
      #   end

      #   # Xóa hết user_location kiểu 'station' của user trước khi thêm mới
      #   UserLocation.where(user_id: user.id, user_location_type: 'station').destroy_all

      #   begin
      #     UserLocation.transaction do
      #       stations.each do |station|
      #         ul = UserLocation.new(
      #           user_id: user.id,
      #           user_location_type: 'station',
      #           user_location_id: station.id,
      #           is_live: params[:is_live],
      #           user_location: station
      #         )
      #         ul.save!
      #       end
      #     end
      #   rescue ActiveRecord::RecordNotUnique => e
      #     error!({
      #       message: I18n.t('user_locations.duplicate_station'),
      #       detail: e.message
      #     }, 409)
      #   rescue => e
      #     error!({ message: I18n.t('user_locations.internal_error', error: e.message) }, 500)
      #   end

      #   present({ message: I18n.t('user_locations.updated_successfully'), data: nil })
      # end

      # ---------- ADDRESS ----------
      desc 'Create address and assign it as user location'
      params do
        requires :user_id, type: Integer
        requires :address_line, type: String
        requires :latitude, type: Float
        requires :longitude, type: Float
        optional :building_name, type: String
        optional :floor, type: String
        optional :note, type: String
        requires :district_id, type: Integer
        requires :town_id, type: Integer
        optional :is_live, type: Boolean
      end
      post :address do
        user = User.find_by(id: params[:user_id])
        error!({ message: I18n.t('user_locations.user_not_found') }, 404) unless user

        district = District.find_by(id: params[:district_id])
        error!({ message: I18n.t('addresses.district_not_found') }, 404) unless district

        town = Town.find_by(id: params[:town_id])
        error!({ message: I18n.t('addresses.town_not_found') }, 404) unless town
        error!({ message: I18n.t('addresses.town_not_in_district') }, 422) unless town.district_id == district.id

        address_params = declared(params, include_missing: false).except(:user_id, :is_live)
        address = Address.new(address_params)

        unless address.save
          error!({ messages: address.errors.full_messages }, 422)
        end

        user_location = UserLocation.new(
          user_id: user.id,
          user_location_type: 'address',
          user_location_id: address.id,
          is_live: params[:is_live],
          user_location: address
        )

        if user_location.save
          present({ message: I18n.t('user_locations.created_successfully'), data: nil })
        else
          error!({ messages: user_location.errors.full_messages }, 422)
        end
      rescue => e
        error!({ message: I18n.t('user_locations.internal_error', error: e.message) }, 500)
      end
    end
  end
end
