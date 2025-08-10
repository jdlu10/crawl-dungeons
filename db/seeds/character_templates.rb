puts "Seeding Character templates..."

character_templates = [
    {
        name: "Garrick",
        vocation: Vocation.find_by(name: "Warrior"),
        race: Race.find_by(key: "human"),
        visual_render: VisualRender.find_by(name: "male_human_1"),
        element: Element.find_by(key: "fire"),
        level: 1,
        experience_points: 0,
        hit_points: 12,
        power_points: 10,
        max_hit_points: 12,
        max_power_points: 10,
        strength: 5,
        dexterity: 3,
        constitution: 4,
        intelligence: 2,
        wisdom: 2,
        charisma: 1,
        template: true,
        description: "A brave warrior ready to face any challenge."
    },
    {
        name: "Tumbletop",
        vocation: Vocation.find_by(name: "Vagabond"),
        race: Race.find_by(key: "dwarf"),
        visual_render: VisualRender.find_by(name: "male_dwarf_1"),
        element: Element.find_by(key: "earth"),
        level: 1,
        experience_points: 0,
        hit_points: 8,
        power_points: 12,
        max_hit_points: 8,
        max_power_points: 12,
        strength: 3,
        dexterity: 5,
        constitution: 4,
        intelligence: 2,
        wisdom: 2,
        charisma: 3,
        template: true,
        description: "A free-spirited vagabond with a knack for mischief."
    },
    {
        name: "Zura",
        vocation: Vocation.find_by(name: "Physician"),
        race: Race.find_by(key: "elf"),
        visual_render: VisualRender.find_by(name: "female_elf_1"),
        element: Element.find_by(key: "water"),
        level: 1,
        experience_points: 0,
        hit_points: 8,
        power_points: 16,
        max_hit_points: 8,
        max_power_points: 16,
        strength: 2,
        dexterity: 3,
        constitution: 2,
        intelligence: 2,
        wisdom: 5,
        charisma: 4,
        template: true,
        description: "A skilled physician with a deep understanding of healing arts."
    },
    {
        name: "Aelira",
        vocation: Vocation.find_by(name: "Scholar"),
        race: Race.find_by(key: "human"),
        visual_render: VisualRender.find_by(name: "female_human_1"),
        element: Element.find_by(key: "darkness"),
        level: 1,
        experience_points: 0,
        hit_points: 6,
        power_points: 18,
        max_hit_points: 6,
        max_power_points: 18,
        strength: 2,
        dexterity: 2,
        constitution: 2,
        intelligence: 5,
        wisdom: 3,
        charisma: 3,
        template: true,
        description: "A learned scholar with a thirst for knowledge and magic."
    }
]

character_templates.each do |character_template|
    Character.find_or_create_by!(character_template)
    puts "Created character template: #{character_template[:name]}"
end

puts "Seeding Character templates completed!"