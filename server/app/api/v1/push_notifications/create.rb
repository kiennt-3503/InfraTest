module V1
  module PushNotifications
    class Create < Grape::API
      helpers V1::Base.helpers

      resource :push_subscriptions do
        desc 'Store Web Push subscription'
        params do
          requires :endpoint, type: String
          requires :keys, type: Hash do
            requires :p256dh, type: String
            requires :auth, type: String
          end
        end
        post do
          subscription = params[:subscription] || params
          @notification = current_user.push_subscriptions.find_or_create_by(
            endpoint: subscription[:endpoint]
          ) do |ps|
            ps.p256dh = subscription[:keys][:p256dh]
            ps.auth = subscription[:keys][:auth]
          end

          if @notification.persisted?
            status 200
          else
            status 422
          end
        end
      end
    end
  end
end
