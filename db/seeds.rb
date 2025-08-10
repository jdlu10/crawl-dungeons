# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Dir[Rails.root.join('db', 'seeds', '*.rb')].sort.each do |seed_file|
#   load seed_file
# end

load 'db/seeds/player_types.rb'
load 'db/seeds/players.rb'
load 'db/seeds/visual_renders.rb'

load 'db/seeds/elements.rb'
load 'db/seeds/equippable_slots.rb'
load 'db/seeds/effects.rb'
load 'db/seeds/items.rb'
load 'db/seeds/item_effects.rb'

load 'db/seeds/vocations.rb'
load 'db/seeds/abilities.rb'
load 'db/seeds/vocation_abilities.rb'
load 'db/seeds/races.rb'

load 'db/seeds/campaigns.rb'
load 'db/seeds/maps.rb'

load 'db/seeds/character_templates.rb'
# load 'db/seeds/monster_templates.rb'
load 'db/seeds/inventories.rb'

# Example for environment-specific seeds:
# if Rails.env.development?
#   Dir[Rails.root.join('db', 'seeds', 'development', '*.rb')].sort.each do |seed_file|
#     load seed_file
#   end
# end

# if Rails.env.production?
#   Dir[Rails.root.join('db', 'seeds', 'production', '*.rb')].sort.each do |seed_file|
#     load seed_file
#   end
# end