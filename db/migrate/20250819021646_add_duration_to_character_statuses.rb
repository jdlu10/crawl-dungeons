class AddDurationToCharacterStatuses < ActiveRecord::Migration[7.1]
  def change
    add_column :character_statuses, :duration, :integer
  end
end
