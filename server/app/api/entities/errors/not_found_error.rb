module Entities
  module Errors
    class NotFoundError < Grape::Entity
      expose :message

      # TODO: add more fields
    end
  end
end
