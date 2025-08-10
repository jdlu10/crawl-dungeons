class NullableEquippableSlotsInItemsTable < ActiveRecord::Migration[7.1]
  def change
    change_column :items, :equippable_slot_id, :integer, null: true
  end
end
