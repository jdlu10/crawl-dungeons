class RenameStateToGameStateInGames < ActiveRecord::Migration[7.1]
  def change
    rename_column :games, :state, :game_state
  end
end
