class CharacterStatus < ApplicationRecord
  belongs_to :character
  belongs_to :status
end
