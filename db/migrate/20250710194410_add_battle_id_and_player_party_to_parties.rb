class AddBattleIdAndPlayerPartyToParties < ActiveRecord::Migration[7.1]
  def change
    add_reference :parties, :battles, null: true, foreign_key: true
    add_column :parties, :player_party, :boolean
  end
end
