class CreateVocationAbilities < ActiveRecord::Migration[7.1]
  def change
    create_table :vocation_abilities do |t|
      t.references :vocation, null: false, foreign_key: true
      t.references :ability, null: false, foreign_key: true

      t.timestamps
    end
  end
end
