puts "Seeding Visual Renders..."

images = [
    { name: "icon_placeholder", render: "---" }
]

images.each do |image|
    VisualRender.find_or_create_by!(image)
    puts "Created visual render: #{image[:name]}"
end

puts "Seeding Visual Renders completed!"