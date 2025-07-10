Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  root "game#index"
  # get "/campaigns", to: "campaigns#index"

  namespace :api do
    namespace :v1 do
      resources :campaigns, only: [:index, :show]
      resources :games do
        collection do
          get 'by_player/:player_id', to: 'games#by_player', as: :by_player
          post 'new_game', to: 'games#new_game', as: :new_game
          delete 'delete_game/:id', to: 'games#delete_game', as: :delete_game
        end
      end
      get 'games/:id', to: 'games#load_game_data', as: :load_game_data
      get 'games/:id/available_characters', to: 'games#list_available_characters', as: :list_available_characters
      get 'games/:id/available_characters/new', to: 'games#list_available_characters_new', as: :list_available_characters_new
      get 'games/:id/party', to: 'games#player_party', as: :player_party
      get 'games/:id/party/characters/new', to: 'games#player_party_character_new', as: :player_party_character_new
    end
  end

end
