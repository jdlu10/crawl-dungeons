class Item < ApplicationRecord
  belongs_to :visual_render
  belongs_to :element
  belongs_to :equippable_slot, optional: true

  has_many :effect_links, as: :attachable
end
