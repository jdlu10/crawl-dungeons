puts "Seeding Elements..."

elements = [
    { name: "Null", key: "null", element_type: "base", visual_render: VisualRender.find_by(name: "element_null"), description: "None element" },
    { name: "Fire", key: "fire", element_type: "base", visual_render: VisualRender.find_by(name: "element_fire"), description: "Fire element" },
    { name: "Water", key: "water", element_type: "base", visual_render: VisualRender.find_by(name: "element_water"), description: "Water element" },
    { name: "Earth", key: "earth", element_type: "base", visual_render: VisualRender.find_by(name: "element_earth"), description: "Earth element" },
    { name: "Air", key: "air", element_type: "base", visual_render: VisualRender.find_by(name: "element_air"), description: "Air element" },
    { name: "Light", key: "light", element_type: "base", visual_render: VisualRender.find_by(name: "element_light"), description: "Light element" }, 
    { name: "Darkness", key: "darkness", element_type: "base", visual_render: VisualRender.find_by(name: "element_darkness"), description: "Darkness element" },
    { name: "Ice", key: "ice", element_type: "base", visual_render: VisualRender.find_by(name: "element_ice"), description: "Ice element" },
    { name: "Lightning", key: "lightning", element_type: "base", visual_render: VisualRender.find_by(name: "element_lightning"), description: "Lightning element" },
    { name: "Poison", key: "poison", element_type: "status", visual_render: VisualRender.find_by(name: "element_poison"), description: "Poison element" },
]

elements.each do |element|
    Element.find_or_create_by!(element)
    puts "Created element: #{element[:name]}"
end

puts "Seeding Elements completed!"