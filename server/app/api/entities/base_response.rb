module Entities
  class BaseResponse < Grape::Entity
    expose :message, documentation: { type: String }

    expose :data, if: ->(instance, options) { options[:data_entity].present? || instance[:data].present? } do |object, options|
      if options[:data_entity].present?
        options[:data_entity].represent(object[:data], options)
      else
        object[:data]
      end
    end
  end
end
