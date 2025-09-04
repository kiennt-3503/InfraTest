class HealthController < ApplicationController
  def show
    render json: {
      status: "ok",
      environment: Rails.env,
      timestamp: Time.current
    }, status: :ok
  end
end
