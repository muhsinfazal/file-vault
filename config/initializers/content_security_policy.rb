Rails.application.config.content_security_policy do |policy|
    if Rails.env.development?
      policy.connect_src :self, :https, "http://localhost:3036"
    end
  end
  