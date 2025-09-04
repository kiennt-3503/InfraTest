Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get 'test_bugsnag', to: 'debug#test_bugsnag' if Rails.env.development? || Rails.env.test?
  get "/health", to: "health#show"
  mount ActionCable.server => '/cable'
  mount GrapeSwaggerRails::Engine => '/api_docs'
  scope "(:locale)", locale: /en|vi|ja/ do
    mount Root => '/'
  end
  namespace :api do
    namespace :v1 do
      post 'sign_up', to: 'users#create'

      resources :users do
        # resources :profiles
      end
      # post 'login', to: 'sessions#create'
      resource :locations, only: [] do
        collection do
          get :regions
          get :prefectures
          get :sections
          get :districts
          get :towns
        end
      end
      resources :chat_rooms do
        get :members, on: :member
      end
      resources :user_locations, only: [:create]
      resources :addresses, only: [:create]
    end
  end
end
