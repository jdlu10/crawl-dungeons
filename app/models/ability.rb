class Ability < ApplicationRecord
  belongs_to :icon, class_name: "VisualRender", optional: true
  belongs_to :element

  has_many :effect_links, as: :attachable
end
