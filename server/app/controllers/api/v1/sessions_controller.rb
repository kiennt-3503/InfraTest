class Api::V1::SessionsController < ApplicationController
  def create
    user = User.find_by(username: params[:username])

    if user&.authenticate(params[:password])
      login_success(user)
    else
      login_failed
    end
  rescue StandardError => e
    handle_exception(e, user)
  end

  private

  def login_success(user)
    token = JsonWebToken.encode(user_id: user.id)
    render json: { token: token, user: user.slice(:id, :username, :email) }, status: :ok
  end

  def login_failed
    Bugsnag.notify("Invalid login attempt") do |report|
      report.severity = "info"
      report.context = "Api::V1::SessionsController#create"
      report.add_tab(:auth_attempt, {
        username: params[:username],
        ip: request.remote_ip,
        user_agent: request.user_agent
      })
    end

    render json: { message: 'Invalid username or password' }, status: :unauthorized
  end

  def handle_exception(exception, user)
    Bugsnag.notify(exception) do |report|
      report.context = "Api::V1::SessionsController#create"
      report.set_user(user&.id, user&.email, nil) if user
    end

    render json: { message: 'Something went wrong' }, status: :internal_server_error
  end
end
