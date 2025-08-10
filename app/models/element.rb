class Element < ApplicationRecord
    has_many :outgoing_effectivenesses,
        class_name: 'ElementEffectiveness',
        foreign_key: 'source_element_id',
        dependent: :destroy

    has_many :incoming_effectivenesses,
        class_name: 'ElementEffectiveness',
        foreign_key: 'target_element_id',
        dependent: :destroy

    has_many :strong_against,
        through: :outgoing_effectivenesses,
        source: :target_element

    has_many :weak_against,
        through: :incoming_effectivenesses,
        source: :source_element

    belongs_to :visual_render
end
