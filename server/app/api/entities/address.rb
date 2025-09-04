module Entities
  class Address < Grape::Entity
    expose :id, as: :address_id
    expose :address_line
    expose :latitude
    expose :longitude
    expose :building_name
    expose :floor
    expose :note
    expose :district_id
    expose :town_id
    expose :created_at
    expose :updated_at
  end
end
