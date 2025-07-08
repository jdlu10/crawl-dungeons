class AddVisualTypeToVisualRenders < ActiveRecord::Migration[7.1]
  def change
    add_column :visual_renders, :visual_type, :string
  end
end
