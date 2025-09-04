class ApplicationController < ActionController::API
  include Pagy::Backend
  before_action :set_locale

  def set_locale
    I18n.locale = params[:locale].presence_in(I18n.available_locales.map(&:to_s)) || I18n.default_locale
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
