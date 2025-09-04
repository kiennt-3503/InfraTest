module V1
  class Profiles < V1::Base
    helpers V1::Base.helpers

    before { authenticate! }
    version 'v1', using: :path
    format :json
    prefix :api

    PROFILE_PARAMS = {
      username: { type: String, desc: 'Username' },
      fullname: {  type: String, desc: 'Full name' },
      fullname_kana: { type: String, desc: 'Full name in Kana' },
      phone: { type: String, desc: "Phone number" },
      bio: { type: String, desc: 'User bio' },
      gender: { type: Integer, desc: 'User gender' },
      birthday: { type: Date, desc: 'User birthday' },
      mbti: { type: Integer, desc: 'MBTI personality type' },
      zodiac: { type: Integer, desc: 'Zodiac' },
      language_proficiency: { type: String, desc: 'Language proficiency' },
      profile_picture_url: { type: String, desc: 'Profile picture URL' },
      avatar_settings: { type: Hash, desc: 'Avatar settings', documentation: { type: 'JSON' } },
    }.freeze

    # Sử dụng class method để trả về params
    class << self
      def profile_params
        PROFILE_PARAMS
      end
    end

    resource :profiles do
      desc "Show current user's profile"
      get do
        profile = current_user.profile
        if profile
          { message: I18n.t('profiles.fetch_success'), data: Entities::Profile.represent(profile) }
        else
          error!({
            message: I18n.t('profiles.not_found'),
          }, :not_found)
        end
      end

      desc "Show another user's profile"
      params do
        requires :user_id, desc: 'ID of the user whose profile is to be fetched'
      end
      get '/:user_id' do
        # Fetch the user by user_id
        user = User.find_by(id: params[:user_id])

        # Return not found if the user does not exist
        unless user
          error!({
            message: I18n.t('profiles.not_found'),
          }, :not_found)
        end

        # Check if the user has a profile
        if user.profile
          {
            message: I18n.t('profiles.fetch_success'),
            data: Entities::Profile.represent(user.profile)
          }
        else
          # Return avatar and username if the profile is missing
          {
            message: I18n.t('profiles.profile_not_found'),
            data: {
              username: user.username,
              id: user.id || 'default_avatar_url' # Replace with your default avatar URL
            }
          }
        end
      end

      desc "Update profile"
      params do
        requires :profile, type: Hash do
          Profiles.profile_params.each do |name, options|
            optional name, **options
          end
        end
      end
      put do
        profile = current_user.profile

        if profile.nil?
          profile = current_user.build_profile
        end

        update_attrs = declared(params, include_missing: false)[:profile] || {}

        validate_profile!(update_attrs)

        if profile.update(update_attrs)
          {
            message: I18n.t('profiles.update_success'),
            data: Entities::Profile.represent(profile)
          }
        else
          error!({
            message: profile.errors.full_messages.join(', '),
          }, 422)
        end
      end
    end

    helpers do
      def validate_profile!(params)
        if params.key?(:avatar_settings)
          puts "Validating avatar settings #{params[:avatar_settings]}" if Rails.env.development?
          missing_keys = %w[bg_color text_color avatar_content].reject { |k| params[:avatar_settings]&.key?(k) }
          unless missing_keys.empty?
            error!({
              message: "Missing required avatar_settings keys: #{missing_keys.join(', ')}",
            }, 422)
          end
        end
      end
    end
  end
end
