class AddUsableOutsideCombatToAbilities < ActiveRecord::Migration[7.1]
  def change
    add_column :abilities, :usable_outside_combat, :boolean
  end
end
