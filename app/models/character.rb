class Character < ApplicationRecord
  belongs_to :vocation
  belongs_to :race
  belongs_to :visual_render
  belongs_to :element

  has_many :inventories, as: :attachable

  validates_uniqueness_of :party_id, scope: %i[party_position_row party_position_column], allow_nil: true

  def filtered_inventories
    inventories.select(&:active?)
  end
end
