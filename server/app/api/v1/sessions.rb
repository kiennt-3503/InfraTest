module V1
  class Sessions < V1::Base
    helpers V1::Base.helpers

    resource :login do
      desc I18n.t("sessions.login.desc"), {
        success: [
          { code: 200, model: Entities::LoginResponse, message: I18n.t("sessions.login.success") }
        ],
        failure: [
          { code: 401, model: Entities::Errors::UnauthorizedError, message: I18n.t("sessions.login.fail") },
          { code: 500, model: Entities::Errors::InternalServerError, message: I18n.t("shared.messages.internal_server_error") }
        ],
        nickname: I18n.t("sessions.login.desc")
      }
      params do
        requires :username, type: String
        requires :password, type: String
        requires :verify_code, type: String
      end

      post do
        valid_code = VerifyCode.valid_code(params[:verify_code])
        error!({ message: I18n.t("sessions.login.fail") }, :unauthorized) if valid_code.blank?

        user = User.by_username(params[:username])
        error!({ message: I18n.t("sessions.login.fail") }, :unauthorized) unless user&.authenticate(params[:password])

        token = JsonWebToken.encode(user_id: user.id)

        RedisService.redis.setex("user_token:#{token}", 1.week.to_i, user.id)
        RedisService.redis.setex("verify_code:#{token}", 1.week.to_i, params[:verify_code])
        data_payload = {
          token: token,
          user: user,
          is_verify: user.user_locations.exists?
        }

        present_response(data_payload:, data_entity: Entities::LoginResponse, message: I18n.t("sessions.login.success"))
      rescue StandardError => e
        Bugsnag.notify(e) do |report|
          report.context = "API::V1::Sessions#login"
          report.set_user(user&.id, user&.email, nil) if defined?(user) && user
        end

        debug_info = Rails.env.production? ? {} : { message: e.message, backtrace: e.backtrace.first(5) }

        error!(
          {
            message: I18n.t("shared.messages.internal_server_error")
          }.merge(debug_info),
          :internal_server_error
        )
      end
    end

    resource :me do
      desc 'Get current user data'
      get do
        authenticate!

        present_response(
          data_payload: {
            user: current_user,
            is_verify: current_user.user_locations.exists?
          },
          data_entity: Entities::LoginResponse,
          message: I18n.t("shared.messages.get_data_success")
        )
      end
    end

    resource :logout do
      desc I18n.t('sessions.logout.desc')
      delete do
        authenticate!

        token = headers['Authorization']&.split(' ')&.last
        error!({ message: I18n.t('sessions.token_missing') }, 401) unless token

        RedisService.redis.del("user_token:#{token}")
        RedisService.redis.del("verify_code:#{token}")

        present_response(
          message: I18n.t('sessions.logout.success')
        )
      rescue StandardError => e
        Bugsnag.notify(e) do |report|
          report.context = "API#logout"
          report.set_user(current_user.id, current_user.username) if current_user
        end

        debug_info = Rails.env.production? ? {} : { message: e.message, backtrace: e.backtrace.first(5) }
        error!(
          {
            message: I18n.t("shared.messages.internal_server_error")
          }.merge(debug_info),
          :internal_server_error
        )
      end
    end
  end
end
