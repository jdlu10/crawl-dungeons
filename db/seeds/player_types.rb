puts "Seeding Player Types..."

PlayerType.find_or_create_by!({
    name: "Admin",
    key: "admin"
})
puts "Created player type: Admin"

puts "Seeding Player Types completed!"