puts "Seeding Vocations..."

vocations = [
    { name: "Warrior", vocation_type: "Fighter", icon: VisualRender.find_by(name: "icon_placeholder") },
    { name: "Vagabond", vocation_type: "Rogue", icon: VisualRender.find_by(name: "icon_placeholder") },
    { name: "Physician", vocation_type: "Healer", icon: VisualRender.find_by(name: "icon_placeholder") },
    { name: "Scholar", vocation_type: "Mage", icon: VisualRender.find_by(name: "icon_placeholder") }
]

vocations.each do |vocation|
    Vocation.find_or_create_by!(vocation)
    puts "Created vocation: #{vocation[:name]}"
end

puts "Seeding Vocations completed!"