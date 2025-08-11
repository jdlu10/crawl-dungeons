class Inventory < ApplicationRecord
    belongs_to :attachable, polymorphic: true
    belongs_to :item

    has_many :item_effects, as: :attachable

    scope :active, -> { where(active: true) }
end
