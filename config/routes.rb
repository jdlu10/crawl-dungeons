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
      # get 'games/:id', to: 'games#load_game_data', as: :load_game_data
      get 'games/:id/available_characters', to: 'games#list_available_characters', as: :list_available_characters
      
      get 'games/:id/party', to: 'games#player_party', as: :player_party
      patch 'games/:id/party/characters/add', to: 'games#player_party_character_add', as: :player_party_character_add
      patch 'games/:id/party/characters/remove', to: 'games#player_party_character_remove', as: :player_party_character_remove
      patch 'games/:id/party/characters/swap', to: 'games#player_party_character_swap_position', as: :player_party_character_swap_position

      patch 'games/:id/party/characters/:character_id/inventory/:iventory_id', to: 'games#move_item_to_character', as: :move_item_to_character
      patch 'games/:id/party/inventory/:inventory_id', to: 'games#move_item_to_party', as: :move_item_to_party
      patch 'games/:id/party/inventory/:inventory_id/use', to: 'games#use_item_in_party_inventory', as: :use_item_in_party_inventory
      patch 'games/:id/party/characters/:character_id/inventory/:inventory_id/equip', to: 'games#equip_item_for_character', as: :equip_item_for_character
      patch 'games/:id/party/characters/:character_id/inventory/:inventory_id/use', to: 'games#use_item_in_character_inventory', as: :use_item_in_character_inventory
      patch 'games/:id/party/characters/:character_id/ability/:ability_id/use', to: 'games#use_character_ability', as: :use_character_ability

      get 'character_template', to: 'games#find_character_template_by_vocation', as: :find_character_template_by_vocation
      get 'get_character_portraits', to: 'games#get_character_portraits', as: :get_character_portraits
      get 'get_vocations', to: 'games#get_vocations', as: :get_vocations
      get 'get_elements', to: 'games#get_elements', as: :get_elements
      get 'get_races', to: 'games#get_races', as: :get_races
      post 'create_new_character', to: 'games#list_available_characters_new', as: :list_available_characters_new

      get 'games/:id/current_map', to: 'games#current_map', as: :current_map

      post 'games/:id/resume_adventure', to: 'games#resume_adventure', as: :resume_adventure

      patch 'games/:id/party/turn', to: 'games#player_party_turn', as: :player_party_turn
      patch 'games/:id/party/move', to: 'games#player_party_move', as: :player_party_move
    end
  end

end
