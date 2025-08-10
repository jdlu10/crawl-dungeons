class AddPrefixAndSuffixToEffects < ActiveRecord::Migration[7.1]
  def change
    add_column :effects, :prefix, :boolean
    add_column :effects, :suffix, :boolean
  end
end
