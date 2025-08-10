puts "Seeding Inventories..."

PLAYER_VOCATIONS.each do |vocation|
    character_template_by_vocation = Character.find_by(template: true, vocation: Vocation.find_by(name: vocation))

    VOCATION_STARTING_INVENTORIES[vocation].each do |item|
        Inventory.find_or_create_by!({ 
            attachable: character_template_by_vocation, 
            item: Item.find_by(name: item[:name], template: true),
            equipped: item[:equipped] 
        })
        puts "Created inventory: #{item[:name]} for #{character_template_by_vocation[:name]}"
    end
end

# inventories = [
#     { attachable: Character.find_by(name: "Garrick", template: true), item: Item.find_by(name: "Longsword", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Garrick", template: true), item: Item.find_by(name: "Light Shield", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Garrick", template: true), item: Item.find_by(name: "Chain Coif", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Garrick", template: true), item: Item.find_by(name: "Chain Mail Shirt", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Tumbletop", template: true), item: Item.find_by(name: "Dagger", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Tumbletop", template: true), item: Item.find_by(name: "Leather Armor", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Tumbletop", template: true), item: Item.find_by(name: "Leather Cap", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Tumbletop", template: true), item: Item.find_by(name: "Buckler", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Aelira", template: true), item: Item.find_by(name: "Staff", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Aelira", template: true), item: Item.find_by(name: "Linen Cloth", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Aelira", template: true), item: Item.find_by(name: "Silver Ring", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Aelira", template: true), item: Item.find_by(name: "Potion of Healing", template: true), equipped: false },
#     { attachable: Character.find_by(name: "Zura", template: true), item: Item.find_by(name: "Mace", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Zura", template: true), item: Item.find_by(name: "Chain Mail Shirt", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Zura", template: true), item: Item.find_by(name: "Light Helm", template: true), equipped: true },
#     { attachable: Character.find_by(name: "Zura", template: true), item: Item.find_by(name: "Herb", template: true), equipped: false }
# ]

# inventories.each do |inventory|
#     Inventory.find_or_create_by!(inventory)
#     puts "Created inventory: #{inventory[:item][:name]} for #{inventory[:attachable][:name]}"
# end

puts "Seeding Inventories completed!"