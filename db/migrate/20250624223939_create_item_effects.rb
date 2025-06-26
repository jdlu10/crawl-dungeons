class CreateItemEffects < ActiveRecord::Migration[7.1]
  def change
    create_table :item_effects do |t|
      t.references :item, null: false, foreign_key: true
      t.string :effect_key
      t.decimal :potency
      t.string :name

      t.timestamps
    end
    add_index :item_effects, :effect_key, unique: true
  end
end
