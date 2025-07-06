class Party < ApplicationRecord
  belongs_to :game

  has_many :characters

  belongs_to :current_map, class_name: 'Map', foreign_key: 'current_map_id', optional: true

  serialize :position, coder: YAML, type: Array
end
