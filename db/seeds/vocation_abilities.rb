puts "Seeding Vocation Abilities..."

vocation_abilities = [
    # Warrior Abilities
    {
        vocation: Vocation.find_by(name: "Warrior"),
        ability: Ability.find_by(key: "weapon_attack"),
    },
    {
        vocation: Vocation.find_by(name: "Warrior"),
        ability: Ability.find_by(key: "defend"),
    },
    {
        vocation: Vocation.find_by(name: "Warrior"),
        ability: Ability.find_by(key: "skills"),
    },
    {
        vocation: Vocation.find_by(name: "Warrior"),
        ability: Ability.find_by(key: "use_item"),
    },
    {
        vocation: Vocation.find_by(name: "Warrior"),
        ability: Ability.find_by(key: "flee"),
    },
    {
        vocation: Vocation.find_by(name: "Warrior"),
        ability: Ability.find_by(key: "power_attack"),
    },
    {
        vocation: Vocation.find_by(name: "Warrior"),
        ability: Ability.find_by(key: "full_swing"),
    },

    # Vagabond Abilities
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "weapon_attack"),
    },
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "defend"),
    },
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "skills"),
    },
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "use_item"),
    },
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "flee"),
    },
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "hide"),
    },
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "sneak_attack"),
    },
    {
        vocation: Vocation.find_by(name: "Vagabond"),
        ability: Ability.find_by(key: "steal"),
    },

    # Physician Abilities
    {
        vocation: Vocation.find_by(name: "Physician"),
        ability: Ability.find_by(key: "weapon_attack"),
    },
    {
        vocation: Vocation.find_by(name: "Physician"),
        ability: Ability.find_by(key: "defend"),
    },
    {
        vocation: Vocation.find_by(name: "Physician"),
        ability: Ability.find_by(key: "magic"),
    },
    {
        vocation: Vocation.find_by(name: "Physician"),
        ability: Ability.find_by(key: "use_item"),
    },
    {
        vocation: Vocation.find_by(name: "Physician"),
        ability: Ability.find_by(key: "flee"),
    },
    {
        vocation: Vocation.find_by(name: "Physician"),
        ability: Ability.find_by(key: "heal"),
    },
    {
        vocation: Vocation.find_by(name: "Physician"),
        ability: Ability.find_by(key: "cure"),
    },

    # Scholar Abilities
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "weapon_attack"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "defend"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "magic"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "use_item"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "flee"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "fire_bolt"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "water_bolt"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "earth_bolt"),
    },
    {
        vocation: Vocation.find_by(name: "Scholar"),
        ability: Ability.find_by(key: "lightning_bolt"),
    },
]

vocation_abilities.each do |vocation_ability|
    VocationAbility.find_or_create_by!(vocation_ability)
    puts "Created vocation ability: #{vocation_ability[:vocation].name} - #{vocation_ability[:ability].name}"
end

puts "Seeding Vocation Abilities completed!"