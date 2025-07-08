class AddDescriptionAndNotesToSomeTables < ActiveRecord::Migration[7.1]
  def change
    add_column :vocations, :description, :string
    add_column :abilities, :description, :string
    add_column :elements, :description, :string
    add_column :characters, :description, :string
    add_column :effects, :description, :string
    add_column :items, :description, :string
  end
end
