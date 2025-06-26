class CreateElementalEffectivenesses < ActiveRecord::Migration[7.1]
  def change
    create_table :elemental_effectivenesses do |t|
      t.decimal :multiplier

      t.timestamps
    end
  end
end
