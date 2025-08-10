class AddPartyToPossessions < ActiveRecord::Migration[7.1]
  def change
    add_reference :possessions, :party, null: true, foreign_key: true
    change_column :possessions, :character_id, :integer, null: true
  end
end
