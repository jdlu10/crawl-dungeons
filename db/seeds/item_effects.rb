puts "Seeding Item Effects..."

item_effects = [
    { attachable: Item.find_by(name: "Mace"), effect: Effect.find_by(effect_key: "stun", potency: 1) },
    { attachable: Item.find_by(name: "Great Hammer"), effect: Effect.find_by(effect_key: "stun", potency: 1) },
    { attachable: Item.find_by(name: "Staff"), effect: Effect.find_by(effect_key: "stun", potency: 1) },
    { attachable: Item.find_by(name: "Spear"), effect: Effect.find_by(effect_key: "reaching", potency: 1) },
    { attachable: Item.find_by(name: "Halberd"), effect: Effect.find_by(effect_key: "reaching", potency: 1) },
    { attachable: Item.find_by(name: "Short Bow"), effect: Effect.find_by(effect_key: "ranged", potency: 1) },
    { attachable: Item.find_by(name: "Long Bow"), effect: Effect.find_by(effect_key: "ranged", potency: 1) },
    { attachable: Item.find_by(name: "Mandate of Heaven"), effect: Effect.find_by(effect_key: "keen") },
    { attachable: Item.find_by(name: "Mandate of Heaven"), effect: Effect.find_by(effect_key: "intelligence", potency: 5) }
]

item_effects.each do |item_effect|
    ItemEffect.find_or_create_by!(item_effect)
    puts "Created item_effect: #{item_effect[:name]}"
end

puts "Seeding Item Effects completed!"