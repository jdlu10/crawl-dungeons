class RemoveCharacterTemplateFromVocations < ActiveRecord::Migration[7.1]
  def change
    remove_column :vocations, :character_template_id
  end
end
