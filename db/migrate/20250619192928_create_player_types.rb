class CreatePlayerTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :player_types do |t|
      t.string :key
      t.string :name

      t.timestamps
    end
  end
end
