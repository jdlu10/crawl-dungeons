class CreateCharacters < ActiveRecord::Migration[7.1]
  def change
    create_table :characters do |t|
      t.string :name
      t.references :vocation, null: false, foreign_key: true
      t.references :race, null: false, foreign_key: true
      t.references :party, null: false, foreign_key: true
      t.integer :party_position
      t.references :visual_render, null: false, foreign_key: true
      t.references :element, null: false, foreign_key: true
      t.integer :level
      t.integer :experience_point
      t.integer :hit_point
      t.integer :power_point
      t.integer :strength
      t.integer :dexterity
      t.integer :constitution
      t.integer :intelligence
      t.integer :wisdom
      t.integer :charisma
      t.boolean :template

      t.timestamps
    end
  end
end
