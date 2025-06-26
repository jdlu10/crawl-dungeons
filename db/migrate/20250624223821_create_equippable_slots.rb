class CreateEquippableSlots < ActiveRecord::Migration[7.1]
  def change
    create_table :equippable_slots do |t|
      t.references :item, null: false, foreign_key: true
      t.string :key
      t.string :name

      t.timestamps
    end
    add_index :equippable_slots, :key, unique: true
  end
end
