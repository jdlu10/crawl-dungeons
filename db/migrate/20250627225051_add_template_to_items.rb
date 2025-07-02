class AddTemplateToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :template, :boolean
    add_reference :items, :equippable_slot, null: false, foreign_key: true
  end
end
