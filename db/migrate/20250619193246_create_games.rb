class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :player, null: false, foreign_key: true
      t.boolean :active

      t.timestamps
    end
  end
end
