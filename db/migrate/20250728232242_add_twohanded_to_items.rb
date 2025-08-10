class AddTwohandedToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :twohanded, :boolean
  end
end
