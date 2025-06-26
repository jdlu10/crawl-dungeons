class CreateVisualRenders < ActiveRecord::Migration[7.1]
  def change
    create_table :visual_renders do |t|
      t.string :name
      t.string :render

      t.timestamps
    end
  end
end
