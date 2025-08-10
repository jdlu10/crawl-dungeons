class AddEffectTypeToEffects < ActiveRecord::Migration[7.1]
  def change
    add_column :effects, :effect_type, :string
  end
end
