class Api::V1::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :find_player_game, only: [:delete_game, :load_game_data, :list_available_characters, :player_party, :list_available_characters_new, :player_party_character_new]

  def index
  end

  def show
    game = Game.find(params[:id])
    render json: game
  end

  def by_player
    player_id = params[:player_id]
    games = Game.where(player_id: player_id, active: true)
    render json: games
  end

  def new_game
    player_id = params[:player_id]
    campaign_id = params[:campaign_id]
    active_games = Game.where(player_id: player_id, active: true)

    if active_games.count < 3
        game = {}
        ActiveRecord::Base.transaction do
          game = Game.new(player_id: player_id, campaign_id: campaign_id, active: true, game_state: "character-creation")
          game.save!
          party = Party.find_or_initialize_by(game: game, name: "Player Party")
          party.current_map = game.campaign.starting_map
          party.position = game.campaign.starting_map.starting_position
          party.facing_direction = "N"
          party.player_party = true
          party.save!
          # duplicate all character templates and save it with the new game
          Character.where(template: true).each do |character_template|
            new_game_character = character_template.dup
            new_game_character.template = false
            new_game_character.games_id = game.id
            new_game_character.save!
          end
        end
        render json: game
    else
        render json: { error: "Too many active save games, please delete 1 to start more games" }, status: :not_acceptable
    end
  end

  def delete_game
    @game.update(active: false)
    render json: { message: "Game deleted successfully" }, status: :ok
  end

  def load_game_data
    render json: @game, status: :ok 
  end

  # get 'games/:id/available_characters', to: 'games#list_available_characters', as: :list_available_characters
  #     get 'games/:id/available_characters/new', to: 'games#list_available_characters_new', as: :list_available_characters_new
  #     get 'games/:id/party', to: 'games#player_party', as: :player_party
  #     get 'games/:id/party/characters/new', to: 'games#player_party_character_new', as: :player_party_character_new
  
  def list_available_characters
    available_characters = Character.where(games_id: @game.id, party_id: nil)
    render json: available_characters, status: :ok
  end
  
  def list_available_characters_new
  end

  def player_party
    party = Party.find_by('game_id': @game.id)
    party_json = party.attributes.merge({
      characters: Character.where(games_id: @game.id, party_id: party.id)
    })
    render json: party_json, status: :ok
  end

  def player_party_character_new
  end

  private

#   def campaign_params
#     params.require(:campaign).permit(:name, :email)
#   end

  def find_player_game
    @game = Game.find_by(id: params[:id], active: true, player_id: params[:player_id])
    unless @game
      render json: { error: "Game not found or already deleted" }, status: :not_found
    end
  end
end