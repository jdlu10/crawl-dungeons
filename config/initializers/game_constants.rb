PLAYER_VOCATIONS = [
    "Warrior","Vagabond","Physician","Scholar"
].freeze

VOCATION_STARTING_INVENTORIES = {
    "Warrior" => [ { name: "Longsword", equipped: true }, {name: "Light Shield", equipped: true }, { name: "Chain Coif", equipped: true }, { name: "Chain Mail Shirt", equipped: true }],
    "Vagabond" => [{ name: "Dagger", equipped: true }, { name: "Leather Armor", equipped: true }, { name: "Leather Cap", equipped: true }, { name: "Buckler", equipped: true }],
    "Physician" => [{ name: "Staff", equipped: true }, { name: "Linen Cloth", equipped: true }, { name: "Silver Ring", equipped: true }, { name: "Potion of Healing", equipped: false }],
    "Scholar" => [{ name: "Mace", equipped: true }, { name: "Chain Mail Shirt", equipped: true }, { name: "Light Helm", equipped: true }, { name: "Herb", equipped: false }]
}.freeze