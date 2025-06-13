class CreateCampaigns < ActiveRecord::Migration[7.1]
  def change
    create_table :campaigns do |t|
      t.string :name
      t.string :key

      t.timestamps
    end
    add_index :campaigns, :key, unique: true
  end
end
