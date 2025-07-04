class RenameTypeColumnsToCategories < ActiveRecord::Migration[7.1]
  def change
    rename_column :vocations, :type, :vocation_type
    rename_column :abilities, :type, :ability_type
    add_column :elements, :element_type, :string
  end
end
