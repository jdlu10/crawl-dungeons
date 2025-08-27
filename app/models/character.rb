class Character < ApplicationRecord
  belongs_to :vocation
  belongs_to :race
  belongs_to :visual_render
  belongs_to :element
  belongs_to :party, optional: true

  has_many :character_statuses
  has_many :statuses, through: :character_statuses
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

  def has_status?(key)
    statuses.exists?(key: key)
  end

  def getDefenseValue
    defense_value = 0
    filtered_inventories.each do |inventory|
      if inventory.equipped
        defense_value += JSON.parse(inventory.item.defensive_value)[0]
      end
    end
    defense_value
  end

  def dead?
    hit_points <= 0
  end
end
