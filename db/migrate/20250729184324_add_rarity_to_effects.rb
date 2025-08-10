class AddRarityToEffects < ActiveRecord::Migration[7.1]
  def change
    add_column :effects, :rarity, :decimal
  end
end
