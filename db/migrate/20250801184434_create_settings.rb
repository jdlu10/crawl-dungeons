class CreateSettings < ActiveRecord::Migration[7.1]
  def change
    create_table :settings do |t|
      t.references :game, null: false, foreign_key: true
      t.boolean :movement_controls_hud

      t.timestamps
    end
  end
end
