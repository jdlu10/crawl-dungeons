class FixEffectColumnNameInItemEffects < ActiveRecord::Migration[7.1]
  def change
    rename_column :item_effects, :effects_id, :effect_id
  end
end
