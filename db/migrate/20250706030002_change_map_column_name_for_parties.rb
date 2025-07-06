class ChangeMapColumnNameForParties < ActiveRecord::Migration[7.1]
  def change
    rename_column :parties, :map_id, :current_map_id
  end
end
