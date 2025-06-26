class AddElementsToElementalEffectiveness < ActiveRecord::Migration[7.1]
  def change
    add_reference :elemental_effectivenesses, :source_element, null: false, foreign_key: {to_table: :elements}
    add_reference :elemental_effectivenesses, :target_element, null: false, foreign_key: {to_table: :elements}
  end
end
