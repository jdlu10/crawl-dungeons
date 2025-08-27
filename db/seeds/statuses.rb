puts "Seeding Statuses..."

statuses = [
    { name: "Defending", key: "defending", status_type: "buff", description: "Provides a defensive bonus against incoming attacks." },
    { name: "Burning", key: "burning", status_type: "debuff", description: "On fire, taking damage over time." },
    { name: "Stunned", key: "stunned", status_type: "debuff", description: "Stunned, chance to be unable to take an action." },
    { name: "Poisoned", key: "poisoned", status_type: "debuff", description: "Poisoned, taking damage over time." },
    { name: "Paralyzed", key: "paralyzed", status_type: "debuff", description: "Paraylzed, would not be able to act for a period of time." },
    { name: "Slowed", key: "slowed", status_type: "debuff", description: "Slowed, move to the end of the turn order." },
    { name: "Hidden", key: "hidden", status_type: "buff", description: "Concealed from view, harder to hit." },
]

statuses.each do |status|
    Status.find_or_create_by!(status)
    puts "Created status: #{status[:name]}"
end

puts "Seeding Statuses completed!"