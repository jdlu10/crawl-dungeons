puts "Seeding Races..."

races = [
    { name: "Human", key: "human" },
    { name: "Elf", key: "elf" },
    { name: "Dwarf", key: "dwarf" },
    { name: "Halfling", key: "halfling" }
]

races.each do |race|
    Race.find_or_create_by!(race)
    puts "Created race: #{race[:name]}"
end

puts "Seeding Races completed!"