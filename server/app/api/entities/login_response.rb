module Entities
  class LoginResponse < Grape::Entity
    expose :token, documentation: { type: String }
    expose :user, using: Entities::User, documentation: { type: Object }
    expose :is_verify, documentation: { type: 'Boolean', desc: 'Whether user has verified location' }
  end
end
