Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }

  namespace :api do
    namespace :v1 do
      get "profile", to: "profiles#show"
    end
  end

  root "home#index"
  get "*path", to: "home#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
