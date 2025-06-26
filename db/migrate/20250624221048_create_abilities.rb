class CreateAbilities < ActiveRecord::Migration[7.1]
  def change
    create_table :abilities do |t|
      t.boolean :passive
      t.string :name
      t.integer :cost
      t.string :type
      t.decimal :potency
      t.integer :range
      t.integer :level
      t.string :group

      t.references :element, null: false, foreign_key: true

      t.timestamps
    end
  end
end
