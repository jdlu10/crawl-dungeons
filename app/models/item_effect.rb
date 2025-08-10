class ItemEffect < ApplicationRecord
  belongs_to :attachable, polymorphic: true
  belongs_to :effect
end
