class AddBattleRefToParty < ActiveRecord::Migration[7.1]
  def change
    remove_column :parties, :battles_id
    add_reference :parties, :battle, null: true, foreign_key: true
  end
end
