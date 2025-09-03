puts "Seeding Effect Statuses..."

effect_statuses = [
    { effect: Effect.find_by(effect_key: "stun", potency: 1), status: Status.find_by(key: "stunned") },
    { effect: Effect.find_by(effect_key: "burn", potency: 1.5), status: Status.find_by(key: "burning") },
    { effect: Effect.find_by(effect_key: "paralyze", potency: 1), status: Status.find_by(key: "paralyzed") },
    { effect: Effect.find_by(effect_key: "slow", potency: 1.5), status: Status.find_by(key: "slowed") },
]

effect_statuses.each do |effect_status|
    EffectStatus.find_or_create_by!(effect_status)
    puts "Created effect_status: #{effect_status[:effect].effect_key} -> #{effect_status[:status].key}"
end

puts "Seeding Effect Statuses completed!"