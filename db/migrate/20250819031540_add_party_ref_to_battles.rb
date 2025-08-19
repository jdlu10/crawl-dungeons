class AddPartyRefToBattles < ActiveRecord::Migration[7.1]
  def change
    add_reference :battles, :party, null: true, foreign_key: true
  end
end
