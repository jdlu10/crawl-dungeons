class Game < ApplicationRecord
  belongs_to :campaign
  belongs_to :player

  has_one :setting
end
