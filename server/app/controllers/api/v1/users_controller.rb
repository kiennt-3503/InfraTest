class Api::V1::UsersController < ApplicationController
  wrap_parameters false
  # POST api/v1/users
  def create
    # if params[:code] != ENV['REGISTER_CODE']
    #   return render json: { error: 'Mã đăng ký không hợp lệ' }, status: :unauthorized
    # end

    verify_code = VerifyCode.find_by(code: params[:verify_code])
    Rails.logger.info ">>> VERIFY CODE record: #{verify_code.inspect}"

    if verify_code.nil? || (verify_code.expired_at.present? && verify_code.expired_at < Time.current)
      return render json: { message: 'Mã xác minh không hợp lệ hoặc đã hết hạn' }, status: :unauthorized
    end

    user = User.new(user_params)

    if user.save
      render json: { message: I18n.t('users.registration_success'), user: user }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:username, :password, :password_confirmation)
  end
end
