class UpdateCampaignsStartingMapColumn < ActiveRecord::Migration[7.1]
  def change
    change_column :campaigns, :starting_map, :integer, :null => true
  end
end
