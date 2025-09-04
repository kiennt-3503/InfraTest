module Entities
  module Stations
    class Station < Grape::Entity
      expose :id
      expose :station_name
      expose :prefecture_id
      expose :post
    end
  end
end
