module Entities
  module Errors
    class InternalServerError < Grape::Entity
      expose :message

      # TODO: add more fields
    end
  end
end
