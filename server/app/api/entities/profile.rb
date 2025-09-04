module Entities
  class Profile < Grape::Entity
    expose :id
    expose :username do |object|
      object[:username]
    end
    expose :id
    expose :fullname
    expose :fullname_kana
    expose :phone
    expose :bio
    expose :gender do |object|
      object[:gender]
    end
    expose :birthday
    expose :mbti do |object|
      object[:mbti]
    end
    expose :zodiac do |object|
      object[:zodiac]
    end
    expose :language_proficiency
    expose :profile_picture_url
    expose :avatar_settings, documentation: { type: 'JSON' }
  end
end
