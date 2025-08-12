class AddAbilityKeyToAbilities < ActiveRecord::Migration[7.1]
  def change
    add_column :abilities, :ability_key, :string
  end
end
