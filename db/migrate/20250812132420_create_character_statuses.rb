class CreateCharacterStatuses < ActiveRecord::Migration[7.1]
  def change
    create_table :character_statuses do |t|
      t.references :character, null: false, foreign_key: true
      t.references :status, null: false, foreign_key: true

      t.timestamps
    end
  end
end
