puts "Seeding Elements..."

elements = [
    { name: "Null", key: "null", element_type: "base" },
    { name: "Fire", key: "fire", element_type: "base" },
    { name: "Water", key: "water", element_type: "base" },
    { name: "Earth", key: "earth", element_type: "base" },
    { name: "Air", key: "air", element_type: "base" },
    { name: "Light", key: "light", element_type: "base" }, 
    { name: "Darkness", key: "darkness", element_type: "base" },
    { name: "Ice", key: "ice", element_type: "base" },
    { name: "Lightning", key: "lightning", element_type: "base" },
    { name: "Poison", key: "poison", element_type: "status" },
]

elements.each do |element|
    Element.find_or_create_by!(element)
    puts "Created element: #{element[:name]}"
end

puts "Seeding Elements completed!"