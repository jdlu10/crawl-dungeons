class AddBelongsToToPossessions < ActiveRecord::Migration[7.1]
  def change
    drop_table :possessions
    remove_column :items, :equippable
    remove_column :items, :hit_point
    remove_column :items, :power_point
    remove_column :items, :strength
    remove_column :items, :dexterity
    remove_column :items, :constitution
    remove_column :items, :intelligence
    remove_column :items, :wisdom
    remove_column :items, :charisma

    add_reference :items, :attachable, polymorphic: true, null: false
  end
end
