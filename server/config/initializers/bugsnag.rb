Bugsnag.configure do |config|
  config.api_key = ENV['BUGSNAG_API_KEY']
  config.release_stage = ENV['RELEASE_STAGE']
  config.notify_release_stages = %w[production staging development]
  config.app_version = ENV['APP_VERSION'] if ENV['APP_VERSION']
  config.add_metadata(:app, {
    environment: ENV['RELEASE_STAGE'],
    ruby_version: RUBY_VERSION,
    rails_version: Rails.version
  })
end
Rails.logger.warn "⚠️ WARNING: Bugsnag API key not set. Error reporting will be disabled." if ENV['RELEASE_STAGE'] != 'test' && ENV['BUGSNAG_API_KEY'].blank?
