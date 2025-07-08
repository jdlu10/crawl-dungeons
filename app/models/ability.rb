class Ability < ApplicationRecord
  belongs_to :icon, class_name: "VisualRender", optional: true
  belongs_to :element
end
