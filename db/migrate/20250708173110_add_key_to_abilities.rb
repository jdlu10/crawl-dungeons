class AddKeyToAbilities < ActiveRecord::Migration[7.1]
  def change
    add_column :abilities, :key, :string
  end
end
