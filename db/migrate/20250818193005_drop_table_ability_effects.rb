class DropTableAbilityEffects < ActiveRecord::Migration[7.1]
  def change
    drop_table :ability_effects
  end
end
