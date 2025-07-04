class Ability < ApplicationRecord
  belongs_to :icon, foreign_key: "visual_render_id", class_name: "VisualRender"
  belongs_to :element
end
