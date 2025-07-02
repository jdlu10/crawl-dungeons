class BattleTurn < ApplicationRecord
  belongs_to :character
  belongs_to :battle
end
