puts "Seeding Effect Links..."

effect_links = [
    { attachable: Item.find_by(name: "Mace"), effect: Effect.find_by(effect_key: "stun", potency: 1) },
    { attachable: Item.find_by(name: "Great Hammer"), effect: Effect.find_by(effect_key: "stun", potency: 1) },
    { attachable: Item.find_by(name: "Staff"), effect: Effect.find_by(effect_key: "stun", potency: 1) },
    { attachable: Item.find_by(name: "Spear"), effect: Effect.find_by(effect_key: "reaching", potency: 1) },
    { attachable: Item.find_by(name: "Halberd"), effect: Effect.find_by(effect_key: "reaching", potency: 1) },
    { attachable: Item.find_by(name: "Short Bow"), effect: Effect.find_by(effect_key: "ranged", potency: 1) },
    { attachable: Item.find_by(name: "Long Bow"), effect: Effect.find_by(effect_key: "ranged", potency: 1) },
    { attachable: Item.find_by(name: "Mandate of Heaven"), effect: Effect.find_by(effect_key: "keen") },
    { attachable: Item.find_by(name: "Mandate of Heaven"), effect: Effect.find_by(effect_key: "intelligence", potency: 5) },
    { attachable: Item.find_by(name: "Herb"), effect: Effect.find_by(effect_key: "healing") },
    { attachable: Item.find_by(name: "Potion of Healing"), effect: Effect.find_by(effect_key: "healing") },
    { attachable: Item.find_by(name: "Potion of Greater Healing"), effect: Effect.find_by(effect_key: "healing") },
    { attachable: Item.find_by(name: "Panacea"), effect: Effect.find_by(effect_key: "curing") },

    { attachable: Ability.find_by(key: "full_swing"), effect: Effect.find_by(effect_key: "row") },
    { attachable: Ability.find_by(key: "fire_bolt"), effect: Effect.find_by(effect_key: "burn") },
    { attachable: Ability.find_by(key: "water_bolt"), effect: Effect.find_by(effect_key: "slow") },
    { attachable: Ability.find_by(key: "earth_bolt"), effect: Effect.find_by(effect_key: "stun") },
    { attachable: Ability.find_by(key: "lightning_bolt"), effect: Effect.find_by(effect_key: "paralyze") },
]

effect_links.each do |effect_link|
    EffectLink.find_or_create_by!(effect_link)
    puts "Created effect_link: #{effect_link[:name]}"
end

puts "Seeding Effect Links completed!"