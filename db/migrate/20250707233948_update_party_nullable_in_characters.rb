class UpdatePartyNullableInCharacters < ActiveRecord::Migration[7.1]
  def change
    change_column :characters, :party_id, :integer, null: true
  end
end
