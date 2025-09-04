# frozen_string_literal: true

require 'jwt'
require 'net/http'
require 'uri'
require 'json'
require 'redis'

class FirebaseJwtDecoderService
  CERTS_CACHE_KEY = 'firebase_google_certs_cache'.freeze

  def self.perform(id_token)
    header = JWT.decode(id_token, nil, false).last
    kid = header['kid']

    certs = get_or_fetch_certs
    cert_pem = certs[kid]
    raise JWT::DecodeError, 'Invalid token: unknown key id' unless cert_pem

    public_key = OpenSSL::X509::Certificate.new(cert_pem).public_key

    payload, = JWT.decode(id_token, public_key, true, {
                            algorithm: 'RS256',
                            iss: "#{ENV['ISSUER_BASE_URL']}#{ENV['FIREBASE_PROJECT_ID']}",
                            verify_iss: true,
                            aud: ENV['FIREBASE_PROJECT_ID'],
                            verify_aud: true,
                            verify_iat: true
                          })
    payload
  end

  class << self
    private

    def get_or_fetch_certs
      cached_certs = RedisService.redis.get(CERTS_CACHE_KEY)
      return JSON.parse(cached_certs) if cached_certs

      uri = URI(ENV['GOOGLE_CERTS_URL'])
      response = Net::HTTP.get_response(uri)
      raise "Failed to fetch Google certs: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

      certs_json = response.body

      cache_control = response['Cache-Control']
      max_age_str = cache_control&.match(/max-age=(\d+)/)&.captures&.first

      if max_age_str && !max_age_str.empty?
        RedisService.redis.setex(CERTS_CACHE_KEY, max_age_str.to_i, certs_json)
      end

      JSON.parse(certs_json)
    end
  end
end
