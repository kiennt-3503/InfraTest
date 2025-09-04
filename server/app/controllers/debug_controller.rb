class DebugController < ApplicationController
  def test_bugsnag
    Bugsnag.notify("Test error from debug controller") do |event|
      event.add_metadata(:diagnostics, {
        test_time: Time.zone.now,
        environment: Rails.env
      })
    end

    raise "Bugsnag test error"
  rescue StandardError => e
    render json: { error: "Error raised and reported to Bugsnag", message: e.message }
  end
end
