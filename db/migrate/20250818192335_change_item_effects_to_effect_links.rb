class ChangeItemEffectsToEffectLinks < ActiveRecord::Migration[7.1]
  def change
    rename_table :item_effects, :effect_links
  end
end
