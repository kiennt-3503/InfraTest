module V1
  class Users < V1::Base
    helpers V1::Base.helpers

    resource :sign_up do
      desc 'Register a new user'
      params do
        requires :username, type: String
        requires :password, type: String
        requires :password_confirmation, type: String
        requires :verify_code, type: String
      end
      post do
        valid_code = VerifyCode.valid_code(params[:verify_code])
        error!({ message: I18n.t('users.invalid_code') }, 401) if valid_code.blank?

        user = User.new(
          username: params[:username],
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        )

        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          RedisService.redis.setex("user_token:#{token}", 1.week.to_i, user.id)
          RedisService.redis.setex("verify_code:#{token}", 1.week.to_i, params[:verify_code])

          data_payload = {
            token: token,
            user: user,
            is_verify: false
          }

          present_response(
            data_payload: data_payload,
            data_entity: Entities::LoginResponse,
            message: I18n.t('users.registration_success')
          )
        else
          error!({ message: user.errors.full_messages }, 422)
        end
      end
    end
  end
end
