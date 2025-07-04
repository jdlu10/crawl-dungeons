# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_07_02_203335) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "abilities", force: :cascade do |t|
    t.boolean "passive"
    t.string "name"
    t.integer "cost"
    t.string "ability_type"
    t.decimal "potency"
    t.integer "range"
    t.integer "level"
    t.string "group"
    t.bigint "element_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "icon_id", null: false
    t.integer "level_requirement"
    t.index ["element_id"], name: "index_abilities_on_element_id"
    t.index ["icon_id"], name: "index_abilities_on_icon_id"
  end

  create_table "battle_turns", force: :cascade do |t|
    t.bigint "character_id", null: false
    t.integer "turn_order"
    t.bigint "battle_id", null: false
    t.integer "row"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["battle_id"], name: "index_battle_turns_on_battle_id"
    t.index ["character_id"], name: "index_battle_turns_on_character_id"
  end

  create_table "battles", force: :cascade do |t|
    t.integer "current_turn"
    t.integer "dropped_wealth"
    t.bigint "dropped_items_id", null: false
    t.integer "experience_gain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dropped_items_id"], name: "index_battles_on_dropped_items_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.string "name"
    t.string "key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "starting_map", default: 1
    t.string "description"
    t.boolean "active"
    t.index ["key"], name: "index_campaigns_on_key", unique: true
  end

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.bigint "vocation_id", null: false
    t.bigint "race_id", null: false
    t.bigint "party_id", null: false
    t.integer "party_position"
    t.bigint "visual_render_id", null: false
    t.bigint "element_id", null: false
    t.integer "level"
    t.integer "experience_point"
    t.integer "hit_point"
    t.integer "power_point"
    t.integer "strength"
    t.integer "dexterity"
    t.integer "constitution"
    t.integer "intelligence"
    t.integer "wisdom"
    t.integer "charisma"
    t.boolean "template"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["element_id"], name: "index_characters_on_element_id"
    t.index ["party_id"], name: "index_characters_on_party_id"
    t.index ["race_id"], name: "index_characters_on_race_id"
    t.index ["visual_render_id"], name: "index_characters_on_visual_render_id"
    t.index ["vocation_id"], name: "index_characters_on_vocation_id"
  end

  create_table "effects", force: :cascade do |t|
    t.string "name"
    t.string "effect_key"
    t.decimal "potency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "elemental_effectivenesses", force: :cascade do |t|
    t.decimal "multiplier"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "source_element_id", null: false
    t.bigint "target_element_id", null: false
    t.index ["source_element_id"], name: "index_elemental_effectivenesses_on_source_element_id"
    t.index ["target_element_id"], name: "index_elemental_effectivenesses_on_target_element_id"
  end

  create_table "elements", force: :cascade do |t|
    t.string "name"
    t.string "key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "element_type"
  end

  create_table "equippable_slots", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.string "key"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_equippable_slots_on_item_id"
    t.index ["key"], name: "index_equippable_slots_on_key", unique: true
  end

  create_table "games", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.bigint "player_id", null: false
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_games_on_campaign_id"
    t.index ["player_id"], name: "index_games_on_player_id"
  end

  create_table "item_effects", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "effects_id", null: false
    t.index ["effects_id"], name: "index_item_effects_on_effects_id"
    t.index ["item_id"], name: "index_item_effects_on_item_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.text "notes"
    t.boolean "equippable"
    t.boolean "valuable"
    t.boolean "usable"
    t.integer "worth"
    t.integer "attack_value"
    t.integer "defensive_value"
    t.decimal "potency"
    t.bigint "visual_render_id", null: false
    t.bigint "element_id", null: false
    t.integer "hit_point"
    t.integer "power_point"
    t.integer "strength"
    t.integer "dexterity"
    t.integer "constitution"
    t.integer "intelligence"
    t.integer "wisdom"
    t.integer "charisma"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "template"
    t.bigint "equippable_slot_id", null: false
    t.index ["element_id"], name: "index_items_on_element_id"
    t.index ["equippable_slot_id"], name: "index_items_on_equippable_slot_id"
    t.index ["visual_render_id"], name: "index_items_on_visual_render_id"
  end

  create_table "maps", force: :cascade do |t|
    t.string "name"
    t.string "tileset"
    t.text "notes"
    t.bigint "campaign_id", null: false
    t.text "detail"
    t.integer "level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_maps_on_campaign_id"
  end

  create_table "parties", force: :cascade do |t|
    t.string "name"
    t.bigint "game_id", null: false
    t.integer "wealth"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "facing_direction"
    t.bigint "map_id", null: false
    t.string "position"
    t.string "status"
    t.index ["game_id"], name: "index_parties_on_game_id"
    t.index ["map_id"], name: "index_parties_on_map_id"
  end

  create_table "player_types", force: :cascade do |t|
    t.string "key"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "players", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.string "password"
    t.text "notes"
    t.bigint "player_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["player_type_id"], name: "index_players_on_player_type_id"
  end

  create_table "possessions", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.bigint "character_id", null: false
    t.boolean "equipped"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_possessions_on_character_id"
    t.index ["item_id"], name: "index_possessions_on_item_id"
  end

  create_table "races", force: :cascade do |t|
    t.string "name"
    t.string "key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "visual_renders", force: :cascade do |t|
    t.string "name"
    t.string "render"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "vocation_abilities", force: :cascade do |t|
    t.bigint "vocation_id", null: false
    t.bigint "ability_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ability_id"], name: "index_vocation_abilities_on_ability_id"
    t.index ["vocation_id"], name: "index_vocation_abilities_on_vocation_id"
  end

  create_table "vocations", force: :cascade do |t|
    t.string "name"
    t.string "vocation_type"
    t.bigint "icon_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["icon_id"], name: "index_vocations_on_icon_id"
  end

  add_foreign_key "abilities", "elements"
  add_foreign_key "abilities", "visual_renders", column: "icon_id"
  add_foreign_key "battle_turns", "battles"
  add_foreign_key "battle_turns", "characters"
  add_foreign_key "battles", "items", column: "dropped_items_id"
  add_foreign_key "characters", "elements"
  add_foreign_key "characters", "parties"
  add_foreign_key "characters", "races"
  add_foreign_key "characters", "visual_renders"
  add_foreign_key "characters", "vocations"
  add_foreign_key "elemental_effectivenesses", "elements", column: "source_element_id"
  add_foreign_key "elemental_effectivenesses", "elements", column: "target_element_id"
  add_foreign_key "equippable_slots", "items"
  add_foreign_key "games", "campaigns"
  add_foreign_key "games", "players"
  add_foreign_key "item_effects", "effects", column: "effects_id"
  add_foreign_key "item_effects", "items"
  add_foreign_key "items", "elements"
  add_foreign_key "items", "equippable_slots"
  add_foreign_key "items", "visual_renders"
  add_foreign_key "maps", "campaigns"
  add_foreign_key "parties", "games"
  add_foreign_key "parties", "maps"
  add_foreign_key "players", "player_types"
  add_foreign_key "possessions", "characters"
  add_foreign_key "possessions", "items"
  add_foreign_key "vocation_abilities", "abilities"
  add_foreign_key "vocation_abilities", "vocations"
  add_foreign_key "vocations", "visual_renders", column: "icon_id"
end
