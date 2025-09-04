module V1
  class Root < Grape::API
    version 'v1', using: :path
    format :json

    mount V1::Sessions
    mount V1::VerifyCodes
    mount V1::Messages
    mount V1::UserLocations
    mount V1::ChatRooms::Base
    mount V1::Users
    mount V1::Locations
    mount V1::Profiles
    mount V1::EmailVerification
    mount V1::PushNotifications::Base
  end
end
