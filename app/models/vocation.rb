class Vocation < ApplicationRecord
  belongs_to :icon, class_name: "VisualRender"
  has_many :vocation_abilities
  has_many :abilities, through: :vocation_abilities, source: :ability
end
