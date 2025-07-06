class AddStartingMapToCampaigns < ActiveRecord::Migration[7.1]
  def change
    remove_column :campaigns, :starting_map
    add_reference :campaigns, :starting_map, null: true, foreign_key: {to_table: :maps}
  end
end
