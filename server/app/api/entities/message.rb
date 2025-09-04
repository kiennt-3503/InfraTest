module Entities
  class Message < Grape::Entity
    expose :id
    expose :content
    expose :message_type
    expose :created_at

    expose :sender do |message, options|
      Sender.represent(message.user, options)
    end

    expose :is_sender do |message, options|
      message.user_id == options[:current_user_id]
    end
  end

  class Sender < Grape::Entity
    expose :id
    expose :username
    expose :profile do |user, options|
      SenderProfile.represent(user.profile, options)
    end
  end

  class SenderProfile < Grape::Entity
    expose :avatar_settings
  end
end
