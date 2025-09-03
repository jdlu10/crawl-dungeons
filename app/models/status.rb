class Status < ApplicationRecord
    has_one :effect, primary_key: :key, foreign_key: :effect_key, class_name: "Effect", dependent: :nullify

    def negative?
        status_type == "debuff"
    end
end
