module V1
  class EmailVerification < V1::Base
    format :json

    resource :email_verification do
      desc "Verify Sun* email", {
        success: Entities::EmailVerification
      }

      params do
        requires :id_token, type: String, desc: "Firebase ID token"
      end

      post do
        payload = FirebaseJwtDecoderService.perform(params[:id_token])
        error!({ message: I18n.t("errors.invalid_token") }, 401) if payload.nil?

        email = payload["email"]
        allowed_domain = ENV["ALLOWED_EMAIL_DOMAIN"]

        unless email&.end_with?("@#{allowed_domain}")
          error!({ message: I18n.t("errors.domain_not_allowed") }, 403)
        end

        user = User.find_by(username: params[:username])
        error!({ message: I18n.t("errors.user_not_found") }, 404) if user.nil?

        if User.exists?(email: email)
          error!({ message: I18n.t("errors.email_taken") }, 422)
        end

        unless user.update(email: email)
          error!({ message: "更新に失敗しました", errors: user.errors.full_messages }, 422)
        end

        present({
          message: I18n.t("messages.email_verified"),
          email: email
        }, with: Entities::EmailVerification)
      end
    end
  end
end
