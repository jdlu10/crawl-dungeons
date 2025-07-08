class AddGameRefToCharacters < ActiveRecord::Migration[7.1]
  def change
    add_reference :characters, :games, null: true, foreign_key: true
  end
end
