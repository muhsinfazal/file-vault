require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module FileVault
  class Application < Rails::Application
    config.load_defaults 7.1

    config.api_only = false
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: "_file_vault_session"
    config.middleware.use Rack::MethodOverride
    config.action_dispatch.cookies_same_site_protection = :lax
  end
end
