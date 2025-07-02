class AddEffectsToItemEffects < ActiveRecord::Migration[7.1]
  def change
    add_reference :item_effects, :effects, null: false, foreign_key: true
    remove_column :item_effects, :name
    remove_column :item_effects, :potency
    remove_column :item_effects, :effect_key
  end
end
