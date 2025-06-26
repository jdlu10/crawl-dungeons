class ElementalEffectiveness < ApplicationRecord
    belongs_to :source_element, class_name: 'Element'
    belongs_to :target_element, class_name: 'Element'

    validates :multiplier, numericality: { greater_than_or_equal_to: 0 }
    validates :source_element_id, uniqueness: { scope: :target_element_id }
end
