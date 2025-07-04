class Vocation < ApplicationRecord
  belongs_to :icon, class_name: "VisualRender"
end
