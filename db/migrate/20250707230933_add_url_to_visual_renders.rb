class AddUrlToVisualRenders < ActiveRecord::Migration[7.1]
  def change
    add_column :visual_renders, :url, :string
  end
end
