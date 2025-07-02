class CreateBattleTurns < ActiveRecord::Migration[7.1]
  def change
    create_table :battle_turns do |t|
      t.references :character, null: false, foreign_key: true
      t.integer :turn_order
      t.references :battle, null: false, foreign_key: true
      t.integer :row

      t.timestamps
    end
  end
end
