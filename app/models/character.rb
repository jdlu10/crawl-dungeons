class Character < ApplicationRecord
  belongs_to :vocation
  belongs_to :race
  belongs_to :visual_render
  belongs_to :element
end
