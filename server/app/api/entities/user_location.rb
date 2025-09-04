module Entities
  class UserLocation < Grape::Entity
    expose :id
    expose :user_id
    expose :user_location_type
    expose :user_location_id
    expose :is_live
    expose :created_at
    expose :updated_at
  end
end
