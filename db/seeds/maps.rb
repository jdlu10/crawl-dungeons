puts "Seeding Maps..."

default_campaign = Campaign.find_by(key: "default_campaign")

maps = [
    {
        name: "level 1",
        tileset: "stones-basic",
        notes: "Default campaign level 1",
        campaign: default_campaign,
        level: 1,
        # W = Wall, . = Floor, S = Start, E = Exit, U = Up, D = Down, T = Treasure, M = Monster
        detail: [
            %w[W W W W W W W W W W W W W W W W W W W W W W W W W W W W W W],
            %w[W . . . . . W . . . . . . W . . . . . . . . . W . . T . . W],
            %w[W . . . . . W W W W W W W W . W W W W W W W W W . . . . . W],
            %w[W . . M . . . . . . . . . . . W . . . . . . . . . . . . . W],
            %w[W . . . . . W W W W W . W W W W . . W . W W W W W W D W W W],
            %w[W . . . . . W . . . W . W . . . . . W . W . . . . W . W . W],
            %w[W W W W W W W W W W W . W . . . . . W . W . . . . W . W . W],
            %w[W . . . W . . . . . . . W W W W W W W . W . . W W W D W W W],
            %w[W . . . W . W W W W W . . . . . . . W . W . . w . . . . . W],
            %w[W . . . W . W . . . W . W W W W W W W . W . . W . . . . . W],
            %w[W W D W W . W W W W W . W . . . . . W . W . . W . . . . . W],
            %w[W . . . . . . . . . . . W . . . . . W D W W W W W W . W W W],
            %w[W . . . . . W W W W W D W . . . . . W . . . . . . W . W . W],
            %w[W . . . . . W . . . W . W W W W . . W . . . . . . W . W . W],
            %w[W W W D W W W . . . W . . . . W . . W . . . . . . W D W W W],
            %w[W . W . W . . . . . W W W W . W . . W W W D W W W W . . . W],
            %w[W . W . W . . W W W W W . W . W . . . . W . W . . W . . . W],
            %w[W . W . W . . W . . . W W W . W W W W W W . W W W W . . . W],
            %w[W W W D W W W W . T . D . . . . . . . . . . . . W W W W D W],
            %w[W . . . . . . W . . . W W W . W W W W W W W W . W . . W . W],
            %w[W . . . . . . W W W W W . W . W . . . . . . W . W W W W . W],
            %w[W . . . . . . D . . T W . W S W . . . . . . W . . . . . . W],
            %w[W W W W W W W W W W W W W W W W W W W W W W W W W W W W W W]
        ]
    }
]

maps.each do |map|
    Map.find_or_create_by!(map)
    puts "Created map: #{map[:name]}"
end

default_campaign.starting_map = Map.find_by(name: "level 1", campaign: default_campaign)
default_campaign.save!

puts "Seeding Maps completed!"