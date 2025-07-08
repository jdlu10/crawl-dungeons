class CreateAbilityEffects < ActiveRecord::Migration[7.1]
  def change
    create_table :ability_effects do |t|
      
      t.references :ability, null: false, foreign_key: true
      t.references :effect, null: false, foreign_key: true

      t.timestamps
    end
  end
end
