class RemoveEquippableSlotIndexInItems < ActiveRecord::Migration[7.1]
  def change
    remove_index :items, :equippable_slot_id
  end
end
