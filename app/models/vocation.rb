class Vocation < ApplicationRecord
  belongs_to :icon, class_name: "VisualRender"
  has_many :vocation_abilities
end
