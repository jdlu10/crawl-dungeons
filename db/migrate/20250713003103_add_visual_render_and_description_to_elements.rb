class AddVisualRenderAndDescriptionToElements < ActiveRecord::Migration[7.1]
  def change
    add_reference :elements, :visual_render, null: true, foreign_key: true
  end
end
