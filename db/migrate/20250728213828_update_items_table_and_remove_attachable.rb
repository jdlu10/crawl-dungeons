class UpdateItemsTableAndRemoveAttachable < ActiveRecord::Migration[7.1]
  def change
    remove_column :items, :attachable_id
    remove_column :items, :attachable_type

    change_column :items, :attack_value, :string
    change_column :items, :defensive_value, :string
  end
end
