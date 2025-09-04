module V1
  module PushNotifications
    class Base < V1::Base
      helpers V1::Base.helpers

      before { authenticate! }

      resource :push_notifications do
        mount V1::PushNotifications::Create
      end
    end
  end
end
