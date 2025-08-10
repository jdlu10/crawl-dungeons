puts "Seeding Vocations..."

vocations = [
    { name: "Warrior", vocation_type: "Fighter", icon: VisualRender.find_by(name: "vocation_warrior"), description: "A melee fighter that excels in dealing damage with weapons." },
    { name: "Vagabond", vocation_type: "Rogue", icon: VisualRender.find_by(name: "vocation_vagabond"), description: "A cunning wanderer who relies on agility, improvisation, and street-smarts to survive." },
    { name: "Physician", vocation_type: "Healer", icon: VisualRender.find_by(name: "vocation_physician"), description: "A skilled healer dedicated to restoring health and supporting allies in and out of battle." },
    { name: "Scholar", vocation_type: "Mage", icon: VisualRender.find_by(name: "vocation_scholar"), description: "A seeker of knowledge who wields ancient wisdom and arcane powers to influence the world." }
]

vocations.each do |vocation|
    Vocation.find_or_create_by!(vocation)
    puts "Created vocation: #{vocation[:name]}"
end

puts "Seeding Vocations completed!"