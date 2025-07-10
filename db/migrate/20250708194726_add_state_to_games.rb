class AddStateToGames < ActiveRecord::Migration[7.1]
  def change
    add_column :games, :state, :string
  end
end
