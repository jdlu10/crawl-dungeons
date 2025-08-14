class AddRarityToCharacters < ActiveRecord::Migration[7.1]
  def change
    add_column :characters, :threat, :decimal
  end
end
