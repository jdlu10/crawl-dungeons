class CreateBattleEnemies < ActiveRecord::Migration[7.1]
  def change
    create_table :battle_enemies do |t|
      t.references :character, null: false, foreign_key: true
      t.references :battle, null: false, foreign_key: true

      t.timestamps
    end
  end
end
