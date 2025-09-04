GrapeSwaggerRails.options.url      = '/en/api/swagger_doc.json' 

if Rails.env.production?
  GrapeSwaggerRails.options.app_url = 'https://sun-touch-api.heasygame.online'
elsif Rails.env.staging?
  GrapeSwaggerRails.options.app_url = 'https://sun-touch-api.heasygame.online'
else
  GrapeSwaggerRails.options.app_url = 'http://localhost:3001'
end
GrapeSwaggerRails.options.app_name = 'Map app'
GrapeSwaggerRails.options.doc_expansion = 'list'

GrapeSwaggerRails.options.before_action do
  authenticate_or_request_with_http_basic do |username, password|
    username == ENV['SWAGGER_USERNAME'] && password == ENV['SWAGGER_PASSWORD']
  end
end
