class RedisService
  class << self
    def redis
      @redis ||= Redis.new(url: redis_url)
    end

    delegate :get, :set, :setex, :del, to: :redis

    private

    def redis_url
      ENV["REDIS_URL"] || "redis://#{ENV.fetch('REDIS_HOST', 'redis')}:#{ENV.fetch('REDIS_PORT', 6379)}"
    end
  end
end
