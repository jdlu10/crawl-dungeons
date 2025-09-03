class AddEffectToStatuses < ActiveRecord::Migration[7.1]
  def change
    create_table :effect_statuses do |t|
      t.references :effect, null: false, foreign_key: true
      t.references :status, null: false, foreign_key: true

      t.timestamps
    end
  end
end
