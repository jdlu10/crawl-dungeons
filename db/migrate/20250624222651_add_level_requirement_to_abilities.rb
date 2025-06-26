class AddLevelRequirementToAbilities < ActiveRecord::Migration[7.1]
  def change
    add_column :abilities, :level_requirement, :integer
  end
end
