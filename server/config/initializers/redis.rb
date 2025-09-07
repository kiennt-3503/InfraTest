```ruby
# frozen_string_literal: true

redis_url = ENV.fetch("REDIS_URL", "redis://localhost:6379/1")

# Configuration for Action Cable
ActionCable.server.config.redis = { url: redis_url }

# Configuration for Caching
Rails.application.config.cache_store = :redis_cache_store, {
  url: redis_url,
  connect_timeout: 5,       # Initial connection timeout in seconds
  read_timeout: 1,          # Timeout for reading from the server in seconds
  write_timeout: 1,         # Timeout for writing to the server in seconds
  reconnect_attempts: 1,    # Number of times to attempt reconnection
  reconnect_delay: 0.5,     # Delay between reconnection attempts in seconds
  reconnect_delay_max: 1.0  # Maximum delay between reconnection attempts
}

# Redis client instance for general use
$redis = Redis.new(url: redis_url)

```
