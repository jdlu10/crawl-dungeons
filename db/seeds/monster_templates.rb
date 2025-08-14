puts "Seeding Monster templates..."

monster_templates = [
    {
        name: "Goblin Warrior",
        vocation: Vocation.find_by(name: "Warrior"),
        race: Race.find_by(key: "human"),
        visual_render: VisualRender.find_by(name: "male_human_1"),
        element: Element.find_by(key: "earth"),
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
        description: "A small, green-skinned fighter clad in ragged armor, wielding crude weapons with cunning and feral aggression.",
        threat: 1.0,
    },
    {
        name: "Skeleton Warrior",
        vocation: Vocation.find_by(name: "Warrior"),
        race: Race.find_by(key: "human"),
        visual_render: VisualRender.find_by(name: "male_human_1"),
        element: Element.find_by(key: "darkness"),
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
        description: "An undead fighter of bleached bones clad in tattered armor, wielding rusted weapons with relentless, unholy resolve.",
        threat: 1.0,
    },
]

monster_templates.each do |monster_template|
    Character.find_or_create_by!(monster_template)
    puts "Created monster template: #{monster_template[:name]}"
end

puts "Seeding Monster templates completed!"