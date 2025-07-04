class Map < ApplicationRecord
  belongs_to :campaign

  serialize :detail, coder: YAML, type: Array
end
