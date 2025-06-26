class CreateRaces < ActiveRecord::Migration[7.1]
  def change
    create_table :races do |t|
      t.string :name
      t.string :key

      t.timestamps
    end
  end
end
