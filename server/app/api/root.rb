require 'grape-swagger'
require 'grape-swagger/entity'

class Root < Grape::API
  format :json
  prefix :api

  helpers do
    def protected!
      auth = Rack::Auth::Basic::Request.new(request.env)

      unless auth.provided? && auth.basic? && auth.credentials &&
              auth.credentials == [ENV['SWAGGER_USERNAME'], ENV['SWAGGER_PASSWORD']]
        error!('401 Unauthorized', 401, { 'WWW-Authenticate' => 'Basic realm="Swagger Documentation"' })
      end
    end
  end

  before do
    if request.path.include?('/api/swagger_doc')
      protected!
    end

    path_segments = request.path.split('/')
    if path_segments.length > 1
      locale = path_segments[1]
      I18n.locale = %w[en vi ja].include?(locale) ? locale : I18n.default_locale
    else
      I18n.locale = I18n.default_locale
    end
  end

  mount V1::Root

  error_entities = Entities::Errors.constants.map { |c| Entities::Errors.const_get(c) }

  add_swagger_documentation(
    api_version: 'v1',
    mount_path: '/swagger_doc',
    hide_documentation_path: true,
    hide_format: true,
    security_definitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    security: [
      {
        Bearer: []
      }
    ],
    models: [
      Entities::User,
      Entities::ChatRooms::ChatRoom,
      Entities::Message,
      Entities::Address,
      Entities::UserLocation,
      Entities::LinkResponse,
      Entities::LoginResponse,
      Entities::BaseResponse,
      Entities::EmailVerification,
      *error_entities
    ]
  )
end
