module Entities
  class User < Grape::Entity
    expose :id, documentation: { type: Integer }
    expose :username
    expose :email
    expose :profile, using: Entities::Profile, documentation: { type: 'Entities::Profile' }
  end
end
