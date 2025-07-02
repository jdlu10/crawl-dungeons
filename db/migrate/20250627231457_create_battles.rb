class CreateBattles < ActiveRecord::Migration[7.1]
  def change
    create_table :battles do |t|
      t.integer :current_turn
      t.integer :dropped_wealth
      t.references :dropped_items, null: false, foreign_key: {to_table: :items}
      t.integer :experience_gain

      t.timestamps
    end
  end
end
