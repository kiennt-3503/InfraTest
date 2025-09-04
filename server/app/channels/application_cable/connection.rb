# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      if current_user
        logger.add_tags 'ActionCable', current_user.id
        Rails.logger.info "ActionCable: User #{current_user.id} connected."
      else
        reject_unauthorized_connection
        Rails.logger.warn "ActionCable: Unauthorized connection rejected."
      end
    end

    def disconnect
      Rails.logger.info "ActionCable: User #{current_user.id} disconnected." if current_user
    end

    private

    def find_verified_user
      token = request.params[:token]
      decoded = JsonWebToken.decode(token)

      user_id = RedisService.get("user_token:#{token}")
      user = User.find_by(id: decoded['user_id'])
      if user.present?
        user
      else
        nil
      end
    rescue => e
      Rails.logger.error "Error finding verified user: #{e.message}"
      nil
    end
  end
end
