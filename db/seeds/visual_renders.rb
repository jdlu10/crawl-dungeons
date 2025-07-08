puts "Seeding Visual Renders..."

images = [
    { name: "icon_placeholder", render: "---" },
    { name: "male_human_1", url: "/images/characters/male-human.png", visual_type: "character" },
    { name: "male_human_2", url: "/images/characters/male-human.png", visual_type: "character" },
    { name: "male_human_3", url: "/images/characters/male-human.png", visual_type: "character" },
    { name: "male_dwarf_1", url: "/images/characters/male-dwarf.png", visual_type: "character" },
    { name: "male_elf_1", url: "/images/characters/male-elf.png", visual_type: "character" },
    { name: "male_orc_1", url: "/images/characters/male-orc.png", visual_type: "character" },
    { name: "female_human_1", url: "/images/characters/female-human.png", visual_type: "character" },
    { name: "female_human_2", url: "/images/characters/female-human-2.png", visual_type: "character" },
    { name: "female_elf_1", url: "/images/characters/female-elf.png", visual_type: "character" },
    { name: "female_elf_2", url: "/images/characters/female-elf-2.png", visual_type: "character" },
]

images.each do |image|
    VisualRender.find_or_create_by!(image)
    puts "Created visual render: #{image[:name]}"
end

puts "Seeding Visual Renders completed!"