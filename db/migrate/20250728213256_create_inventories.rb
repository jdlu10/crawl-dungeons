class CreateInventories < ActiveRecord::Migration[7.1]
  def change
    create_table :inventories do |t|

      t.references :item, null: false, foreign_key: true
      t.references :attachable, polymorphic: true, null: false
      t.boolean :equipped

      t.timestamps
    end
  end
end
