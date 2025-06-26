class CreateParties < ActiveRecord::Migration[7.1]
  def change
    create_table :parties do |t|
      t.string :name
      t.references :game, null: false, foreign_key: true
      t.integer :wealth

      t.timestamps
    end
  end
end
