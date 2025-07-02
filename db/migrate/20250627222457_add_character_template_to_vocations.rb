class AddCharacterTemplateToVocations < ActiveRecord::Migration[7.1]
  def change
    add_reference :vocations, :character_template, null: false, foreign_key: {to_table: :characters}
  end
end
