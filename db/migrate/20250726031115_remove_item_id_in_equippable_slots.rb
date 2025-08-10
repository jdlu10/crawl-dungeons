class RemoveItemIdInEquippableSlots < ActiveRecord::Migration[7.1]
  def change
    remove_column :equippable_slots, :item_id
  end
end
