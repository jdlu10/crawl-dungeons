class CreateEffects < ActiveRecord::Migration[7.1]
  def change
    create_table :effects do |t|
      t.string :name
      t.string :effect_key
      t.decimal :potency

      t.timestamps
    end
  end
end
