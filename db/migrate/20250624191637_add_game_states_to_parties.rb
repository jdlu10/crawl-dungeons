class AddGameStatesToParties < ActiveRecord::Migration[7.1]
  def change
    add_column :parties, :facing_direction, :string
    add_reference :parties, :map, null: false, foreign_key: true
    add_column :parties, :position, :string
    add_column :parties, :status, :string
  end
end
