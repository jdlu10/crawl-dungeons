class AddActiveToInventories < ActiveRecord::Migration[7.1]
  def change
    add_column :inventories, :active, :boolean
  end
end
