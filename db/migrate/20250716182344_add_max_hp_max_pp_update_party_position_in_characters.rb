class AddMaxHpMaxPpUpdatePartyPositionInCharacters < ActiveRecord::Migration[7.1]
  def change
    change_column :characters, :party_position, :string
    add_column :characters, :max_hit_points, :integer
    add_column :characters, :max_power_points, :integer
  end
end
