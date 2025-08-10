puts "Seeding Effects..."

effects = [
    { name: "Minor Strength", effect_key: "strength", potency: 1, description: "Increases your strength slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Minor Dexterity", effect_key: "dexterity", potency: 1, description: "Increases your dexterity slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Minor Constitution", effect_key: "constitution", potency: 1, description: "Increases your constitution slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Minor Intelligence", effect_key: "intelligence", potency: 1, description: "Increases your intelligence slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Minor Wisdom", effect_key: "wisdom", potency: 1, description: "Increases your wisdom slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Minor Charisma", effect_key: "charisma", potency: 1, description: "Increases your charisma slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Minor Health", effect_key: "health", potency: 5, description: "Increases your health slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Minor Power", effect_key: "power", potency: 5, description: "Increases your power slightly", effect_type: 'all', prefix: false, suffix: true, rarity: 50.0 },
    { name: "Major Strength", effect_key: "strength", potency: 5, description: "Increases your strength greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Major Dexterity", effect_key: "dexterity", potency: 5, description: "Increases your dexterity greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Major Constitution", effect_key: "constitution", potency: 5, description: "Increases your constitution greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Major Intelligence", effect_key: "intelligence", potency: 5, description: "Increases your intelligence greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Major Wisdom", effect_key: "wisdom", potency: 5, description: "Increases your wisdom greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Major Charisma", effect_key: "charisma", potency: 5, description: "Increases your charisma greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Major Health", effect_key: "health", potency: 20, description: "Increases your health greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Major Power", effect_key: "power", potency: 20, description: "Increases your power greatly", effect_type: 'all', prefix: false, suffix: true, rarity: 10.0 },
    { name: "Quick", effect_key: "quick", potency: 1.5, description: "Chance to attack twice", effect_type: 'weapons', prefix: true, suffix: false, rarity: 5.0 },
    { name: "Keen", effect_key: "keen", potency: 1.5, description: "More chance for critical physical hit", effect_type: 'weapons', prefix: true, suffix: false, rarity: 10.0 },
    { name: "Stunning", effect_key: "stun", potency: 1, description: "Chance to stun", effect_type: 'weapons', prefix: true, suffix: false, rarity: 20.0 },
    { name: "Paralysis", effect_key: "paralyze", potency: 1, description: "Chance to paraylyze", effect_type: 'weapons', prefix: true, suffix: false, rarity: 20.0 },
    { name: "Splashing", effect_key: "splash", potency: 0.5, description: "Damages adjacent enemies", effect_type: 'weapons', prefix: true, suffix: false, rarity: 20.0 },
    { name: "Cleaving", effect_key: "cleave", potency: 1, description: "Damages whole row of enemies", effect_type: 'weapons', prefix: true, suffix: false, rarity: 20.0 },
    { name: "Sharp", effect_key: "sharp", potency: 1, description: "Chance to make target bleed", effect_type: 'weapons', prefix: true, suffix: false, rarity: 20.0 },
    { name: "Superior", effect_key: "quality", potency: 1.2, description: "Superior quality", effect_type: 'weapons', prefix: true, suffix: false, rarity: 20.0 },
    { name: "Masterwork", effect_key: "quality", potency: 1.5, description: "Master quality", effect_type: 'weapons', prefix: true, suffix: false, rarity: 5.0 },

    { name: "Reaching", effect_key: "reaching", potency: 1, description: "Long reach", effect_type: 'abilities', prefix: false, suffix: false, rarity: 10.0 },
    { name: "Ranged", effect_key: "ranged", potency: 1, description: "Long range", effect_type: 'abilities', prefix: false, suffix: false, rarity: 10.0 },
    
    { name: "Group", effect_key: "group", potency: 1, description: "Targets entire group", effect_type: 'abilities', prefix: false, suffix: false, rarity: 5.0 },
    { name: "Row", effect_key: "row", potency: 1, description: "Targets a row", effect_type: 'abilities', prefix: false, suffix: false, rarity: 10.0 },
]

effects.each do |effect|
    Effect.find_or_create_by!(effect)
    puts "Created effect: #{effect[:name]}"
end

puts "Seeding Effects completed!"