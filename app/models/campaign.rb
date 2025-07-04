class Campaign < ApplicationRecord
    belongs_to :starting_map, class_name: "Map", optional: true
end
