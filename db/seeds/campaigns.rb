puts "Seeding Campaigns..."

Campaign.find_or_create_by!({
    name: "Default Campaign",
    description: "This is the default campaign for the game.",
    key: "default_campaign",
    active: true
})
puts "Created campaign: Default Campaign"

puts "Seeding Campaigns completed!"