class CreateStatuses < ActiveRecord::Migration[7.1]
  def change
    create_table :statuses do |t|
      t.string :name
      t.string :key
      t.string :status_type
      t.string :description

      t.timestamps
    end
  end
end
