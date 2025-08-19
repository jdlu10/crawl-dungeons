class Inventory < ApplicationRecord
    belongs_to :attachable, polymorphic: true
    belongs_to :item

    has_many :effect_links, as: :attachable

    scope :active, -> { where(active: true) }
end
