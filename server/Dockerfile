# syntax = docker/dockerfile:1

ARG RUBY_VERSION=3.3.0-slim-bullseye
FROM ruby:$RUBY_VERSION AS base

ARG RAILS_ENV=production
ENV RAILS_ENV=$RAILS_ENV \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development test" \
    BUNDLER_VERSION=2.5.7 \
    NOKOGIRI_USE_SYSTEM_LIBRARIES=false

WORKDIR /rails

RUN gem install bundler -v "$BUNDLER_VERSION"

FROM base AS build

RUN apt-get update -qq && apt-get install --no-install-recommends -y \
    build-essential \
    libc6-dev \
    libc-dev \
    libpq-dev \
    libssl-dev \
    libyaml-dev \
    libgmp-dev \
    libgmp3-dev \
    libreadline-dev \
    zlib1g-dev \
    ruby-dev \
    pkg-config \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./

RUN bundle config set deployment true && \
    if [ "$RAILS_ENV" = "production" ]; then \
      bundle install --jobs 1 --retry 3; \
    else \
      bundle install --jobs "$(nproc)" --retry 3; \
    fi && \
    rm -rf ~/.bundle /usr/local/bundle/ruby/*/cache

COPY . .

RUN bundle exec bootsnap precompile --gemfile app/ lib/ || true

FROM base AS app

RUN apt-get update -qq && apt-get install --no-install-recommends -y \
    libvips \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails
COPY bin/docker-entrypoint /usr/bin/docker-entrypoint
RUN chmod +x /usr/bin/docker-entrypoint

RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails /rails

USER rails:rails

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["/usr/bin/docker-entrypoint"]

EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
