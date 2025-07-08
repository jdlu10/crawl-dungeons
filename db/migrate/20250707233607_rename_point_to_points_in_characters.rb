class RenamePointToPointsInCharacters < ActiveRecord::Migration[7.1]
  def change
    rename_column :characters, :experience_point, :experience_points
    rename_column :characters, :hit_point, :hit_points
    rename_column :characters, :power_point, :power_points
  end
end
