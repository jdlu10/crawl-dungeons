class Effect < ApplicationRecord
    has_many :effect_statuses, dependent: :destroy
    has_many :statuses, through: :effect_statuses, source: :status

end
