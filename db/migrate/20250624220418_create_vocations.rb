class CreateVocations < ActiveRecord::Migration[7.1]
  def change
    create_table :vocations do |t|
      t.string :name
      t.string :type
      t.references :icon, null: false, foreign_key: {to_table: :visual_renders}

      t.timestamps
    end
  end
end
