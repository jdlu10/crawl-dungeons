class AddIconToAbilities < ActiveRecord::Migration[7.1]
  def change
    add_reference :abilities, :icon, null: false, foreign_key: {to_table: :visual_renders}
  end
end
