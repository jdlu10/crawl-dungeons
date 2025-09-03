class Effect < ApplicationRecord
    has_many :statuses, primary_key: :effect_key, foreign_key: :effect_key, class_name: "Status", dependent: :nullify

end
