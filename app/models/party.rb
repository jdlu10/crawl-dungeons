class Party < ApplicationRecord
  belongs_to :game

  has_many :characters
  has_many :inventories, as: :attachable

  belongs_to :current_map, class_name: 'Map', foreign_key: 'current_map_id', optional: true

  serialize :position, coder: YAML, type: Array

  def filtered_inventories
    inventories.select(&:active?)
  end
end
