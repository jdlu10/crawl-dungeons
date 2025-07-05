class Api::V1::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token

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
        game = Game.new(player_id: player_id, campaign_id: campaign_id, active: true)
        game.save
        render json: game
    else
        render json: { error: "Too many active save games, please delete 1 to start more games" }, status: :not_acceptable
    end
  end

  def delete_game
    game = Game.find_by(id: params[:id], active: true, player_id: params[:player_id])
    if game
        game.update(active: false)
        render json: { message: "Game deleted successfully" }, status: :ok  
    else
        render json: { error: "Game not found or already deleted" }, status: :not_found
    end
  end

  private

#   def campaign_params
#     params.require(:campaign).permit(:name, :email)
#   end
end