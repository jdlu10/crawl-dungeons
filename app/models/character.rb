class Character < ApplicationRecord
  belongs_to :vocation
  belongs_to :race
  belongs_to :visual_render
  belongs_to :element

  has_many :inventories, as: :attachable

  validates_uniqueness_of :party_id, scope: %i[party_position_row party_position_column], allow_nil: true

  def filtered_inventories
    inventories.select(&:active?)
  end

  def getEquippedItem(equippable_slot_key = "nothing")
    filtered_inventories.find do |inventory|
      inventory.equipped && inventory.item.equippable_slot.key == equippable_slot_key
    end
  end
end
