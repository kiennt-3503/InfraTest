class Api::V1::AddressesController < ApplicationController
  def create
    district = District.find_by(id: address_params[:district_id])
    return render json: { message: 'District not found' }, status: :not_found unless district

    town = Town.find_by(id: address_params[:town_id])
    return render json: { message: 'Town not found' }, status: :not_found unless town

    return render json: { message: 'Town does not belong to the specified district' }, status: :unprocessable_entity unless town.district_id == district.id

    address = Address.new(address_params)

    if address.save
      render json: address, status: :created
    else
      render json: { message: address.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def address_params
    params.require(:address).permit(
      :address_line,
      :latitude,
      :longitude,
      :building_name,
      :floor,
      :note,
      :district_id,
      :town_id
    )
  end
end
