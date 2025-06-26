class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.string :name
      t.text :notes
      t.boolean :equippable
      t.boolean :valuable
      t.boolean :usable
      t.integer :worth
      t.integer :attack_value
      t.integer :defensive_value
      t.decimal :potency
      t.references :visual_render, null: false, foreign_key: true
      t.references :element, null: false, foreign_key: true
      t.integer :hit_point
      t.integer :power_point
      t.integer :strength
      t.integer :dexterity
      t.integer :constitution
      t.integer :intelligence
      t.integer :wisdom
      t.integer :charisma

      t.timestamps
    end
  end
end
