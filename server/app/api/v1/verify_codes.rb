module V1
  class VerifyCodes < V1::Base
    helpers V1::Base.helpers

    resource :verify_codes do
      desc I18n.t("verify_codes.link_verify_code.desc") do
        success [
          { code: 200, model: Entities::LinkResponse, message: I18n.t("shared.messages.get_data_success") }
        ]
        failure [
          { code: 404, model: Entities::Errors::NotFoundError, message: I18n.t("shared.messages.not_found") },
          { code: 500, model: Entities::Errors::InternalServerError, message: I18n.t("shared.messages.internal_server_error") }
        ]
      end

      get :link_verify_code do
        link = RedisService.get("link_verify_code")
        if link.blank?
          current_code = VerifyCode.current_code
          link = current_code.link
          RedisService.set("link_verify_code", link, ex: current_code.expired_at)
        end

        present_response data_payload: { link: }, data_entity: Entities::LinkResponse
      end

      desc I18n.t("verify_codes.refresh_token.desc")

      params do
        requires :verify_code, type: String, desc: 'User input verify code'
      end

      post :refresh_token do
        authenticate!

        token = headers['Authorization']&.split(' ')&.last

        error!({ message: I18n.t('sessions.token_missing') }, 401) unless token

        input_code = params[:verify_code]

        current_code_record = VerifyCode.current_code
        error!({ message: I18n.t('sessions.verify_code_invalid') }, 401) unless current_code_record

        error!({ message: I18n.t('sessions.verify_code_invalid') }, 401) if input_code != current_code_record.code

        decoded = begin
          JsonWebToken.decode(token)
        rescue StandardError
          nil
        end
        error!({ message: I18n.t('sessions.token_invalid') }, 401) unless decoded

        user = User.find_by(id: decoded['user_id'])
        error!({ message: I18n.t('sessions.user_not_found') }, 401) unless user

        RedisService.redis.del("user_token:#{token}")
        RedisService.redis.del("verify_code:#{token}")

        new_token = JsonWebToken.encode(user_id: user.id)

        RedisService.redis.setex("user_token:#{new_token}", 1.week.to_i, user.id)
        RedisService.redis.setex("verify_code:#{new_token}", 1.week.to_i, current_code_record.code)

        present_response(
          data_payload: { token: new_token },
          message: I18n.t('sessions.token_refreshed_success')
        )
      end
    end
  end
end
