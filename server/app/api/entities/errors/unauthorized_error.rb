module Entities
  module Errors
    class UnauthorizedError < Grape::Entity
      expose :message

      # TODO: add more fields
    end
  end
end
