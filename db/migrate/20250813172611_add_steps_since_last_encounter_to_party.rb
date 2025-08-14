class AddStepsSinceLastEncounterToParty < ActiveRecord::Migration[7.1]
  def change
    add_column :parties, :steps_since_last_encounter, :integer
  end
end
