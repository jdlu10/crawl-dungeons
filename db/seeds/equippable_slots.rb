puts "Seeding Equippable Slots..."

equippable_slots = [
    { name: "Head", key: "head" },
    { name: "Neck", key: "neck" },
    { name: "Body", key: "body" },
    { name: "Back", key: "back" },
    { name: "Feet", key: "feet" },
    { name: "Waist", key: "waist" },
    { name: "Hands", key: "hands" },
    { name: "Left Hand One", key: "left_hand_one" },
    { name: "Right Hand One", key: "right_hand_one" },
    { name: "Left Hand Two", key: "left_hand_two" },
    { name: "Right Hand Two", key: "right_hand_two" },
    { name: "Left Ring", key: "left_ring" },
    { name: "Right Ring", key: "right_ring" }
]

equippable_slots.each do |equippable_slot|
    EquippableSlot.find_or_create_by!(equippable_slot)
    puts "Created equippable_slot: #{equippable_slot[:name]}"
end

puts "Seeding Equippable Slots completed!"