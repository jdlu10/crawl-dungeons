class Inventory < ApplicationRecord
    belongs_to :attachable, polymorphic: true
    belongs_to :item

    has_many :item_effects, as: :attachable
end
