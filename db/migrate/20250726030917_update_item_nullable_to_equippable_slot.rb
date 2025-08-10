class UpdateItemNullableToEquippableSlot < ActiveRecord::Migration[7.1]
  def change
    change_column :equippable_slots, :item_id, :integer, null: true
  end
end
