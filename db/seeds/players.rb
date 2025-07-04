puts "Seeding Players..."

Player.find_or_create_by!({
    email: "admin@jdlu.com",
    password: "admin123",
    name: "Admin Test Player",
    notes: "admin_test", 
    player_type: PlayerType.find_by(key: "admin")
})
puts "Created player: Admin Player"

puts "Seeding Players completed!"