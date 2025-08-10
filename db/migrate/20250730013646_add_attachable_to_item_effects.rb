class AddAttachableToItemEffects < ActiveRecord::Migration[7.1]
  def change
    remove_column :item_effects, :item_id

    add_reference :item_effects, :attachable, polymorphic: true, null: false
  end
end
