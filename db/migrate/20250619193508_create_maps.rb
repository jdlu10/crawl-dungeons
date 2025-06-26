class CreateMaps < ActiveRecord::Migration[7.1]
  def change
    create_table :maps do |t|
      t.string :name
      t.string :tileset
      t.text :notes
      t.references :campaign, null: false, foreign_key: true
      t.text :detail
      t.integer :level

      t.timestamps
    end
  end
end
