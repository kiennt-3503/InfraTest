class Api::V1::UserLocationsController < ApplicationController
  def create
    user = find_user
    return render_user_not_found unless user

    location, entity_name = find_location
    return render_invalid_type unless entity_name
    return render_location_not_found(entity_name) unless location

    user_location = UserLocation.new(user_location_params.merge(user_location: location))

    if user_location.save
      render json: { message: 'User location created successfully' }, status: :created
    else
      render json: { errors: user_location.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_location_params
    params.require(:user_location).permit(:user_id, :user_location_type, :user_location_id, :is_live)
  end

  def find_user
    User.find_by(id: user_location_params[:user_id])
  end

  def find_location
    case user_location_params[:user_location_type]
    when 'station'
      [Station.find_by(id: user_location_params[:user_location_id]), 'Station']
    when 'address'
      [Address.find_by(id: user_location_params[:user_location_id]), 'Address']
    else
      [nil, nil]
    end
  end

  def render_user_not_found
    render json: { message: 'User not found' }, status: :not_found
  end

  def render_invalid_type
    render json: { message: 'Invalid location type' }, status: :unprocessable_entity
  end

  def render_location_not_found(entity_name)
    render json: { message: "#{entity_name} not found" }, status: :not_found
  end
end
