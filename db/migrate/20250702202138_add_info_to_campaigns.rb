class AddInfoToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :description, :string
    add_column :campaigns, :active, :boolean
  end
end
