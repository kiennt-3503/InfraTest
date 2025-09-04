module V1
  class Base < Grape::API
    format :json

    helpers do
      def current_user
        return @current_user if defined?(@current_user)

        token = extract_token_from_header
        decoded = decode_token(token)
        fetch_user_id_from_redis(token)
        user = find_user(decoded['user_id'])
        verify_code_check(token)

        @current_user = user
      end

      def authenticate!
        error!({ message: I18n.t('sessions.unauthorized') }, 401) unless current_user
      end

      def present_response(data_payload: nil, data_entity: nil,
                           message: I18n.t("shared.messages.get_data_success"), status: :ok, options: {})
        response_message = message || I18n.t("shared.messages.success")

        response_data = {
          message: response_message,
          data: data_payload
        }

        present response_data, with: Entities::BaseResponse, **options.merge(data_entity: data_entity, status: status)
      end

      # TODO: present_error_response
      private

      def extract_token_from_header
        token = headers['Authorization']&.split(' ')&.last
        error!({ message: I18n.t('sessions.token_missing') }, 401) unless token
        token
      end

      def decode_token(token)
        decoded = JsonWebToken.decode(token)
        error!({ message: I18n.t('sessions.token_invalid') }, 401) unless decoded
        decoded
      rescue StandardError
        error!({ message: I18n.t('sessions.token_invalid') }, 401)
      end

      def fetch_user_id_from_redis(token)
        user_id = RedisService.get("user_token:#{token}")
        error!({ message: I18n.t('sessions.token_expired') }, 402) unless user_id
        user_id
      end

      def find_user(user_id)
        user = User.find_by(id: user_id)
        error!({ message: I18n.t('sessions.user_not_found') }, 401) unless user
        user
      end

      def verify_code_check(token)
        verify_code_used = RedisService.get("verify_code:#{token}")
        latest_code = VerifyCode.current_code&.code

        return unless verify_code_used.blank? || latest_code.blank? || verify_code_used != latest_code

        error!({ message: I18n.t('sessions.verify_code_invalid') }, 498)
      end
    end
  end
end
