class UpdatePartyPositionInCharacters < ActiveRecord::Migration[7.1]
  def change
    remove_column :characters, :party_position
    add_column :characters, :party_position_row, :integer
    add_column :characters, :party_position_column, :integer
  end
end
