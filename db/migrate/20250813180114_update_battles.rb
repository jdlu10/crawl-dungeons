class UpdateBattles < ActiveRecord::Migration[7.1]
  def change
    remove_column :battles, :dropped_items_id
    rename_column :battles, :current_turn, :current_turn_character_id
    add_column :battles, :round, :integer
    add_column :battles, :turn_order, :string

    drop_table :battle_turns
  end
end
