class Battle < ApplicationRecord
  has_many :inventories, as: :attachable
end
