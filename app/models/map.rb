class Map < ApplicationRecord
  belongs_to :campaign

  serialize :detail, coder: YAML, type: Array

  def starting_position
    found = false
    coordinates = [-1,-1] # Default coordinates if 'S' is not found
    detail.each_with_index do |row, row_index|
      row.each_with_index do |char, col_index|
        if char == 'S'
          # puts "Character 'S' found at row #{row_index}, column #{col_index}"
          coordinates = [row_index, col_index]
          found = true
          break # Stop searching once found
        end
      end
      break if found
    end
    coordinates
  end
end
