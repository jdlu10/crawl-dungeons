class CreatePlayers < ActiveRecord::Migration[7.1]
  def change
    create_table :players do |t|
      t.string :email
      t.string :name
      t.string :password
      t.text :notes
      t.references :player_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
