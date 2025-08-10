class VocationAbility < ApplicationRecord
  belongs_to :vocation
  belongs_to :ability
  has_many :abilities, -> { order(:level_requirement) }
end
