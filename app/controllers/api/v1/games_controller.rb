class Api::V1::GamesController < ApplicationController
  include JsonErrorHandler

  skip_before_action :verify_authenticity_token
  before_action :find_player_game, only: [
    :delete_game,
    :list_available_characters,
    :player_party,
    :player_party_character_add,
    :player_party_character_remove,
    :player_party_character_swap_position,
    :resume_adventure,
    :current_map,
    :player_party_turn,
    :player_party_move,
    :move_item,
    :use_item,
    :equip_item,
    :discard_item,
    :use_character_ability,
    :combat_info,
    :combat_use_ability
  ]

  def index
  end

  def show
    game = Game.find(params[:id])
    render json: game.as_json(include: :setting), status: :ok
  end

  def by_player
    player_id = params[:player_id]
    games = Game.where(player_id: player_id, active: true)
    render json: games
  end

  def new_game
    player_id = params[:player_id]
    campaign_id = params[:campaign_id]
    active_games = Game.where(player_id: player_id, active: true)

    if active_games.count < 3
        game = {}
        
        ActiveRecord::Base.transaction do
          game = Game.new(player_id: player_id, campaign_id: campaign_id, active: true, game_state: "party-preparation")
          game.save!
          # create a new game setting record
          setting = Setting.new(game: game, movement_controls_hud: true)
          setting.save!

          battle = Battle.new()
          battle.save!

          party = Party.new(game: game, name: "Player Party")
          party.current_map = game.campaign.starting_map
          party.position = game.campaign.starting_map.starting_position
          party.facing_direction = "N"
          party.position = find_starting_position(game)
          party.wealth = 0
          party.player_party = true
          party.battles_id = battle.id
          party.save!
          # duplicate all character templates and save it with the new game
          Character.where(template: true, threat: nil).each do |character_template|
            new_game_character = character_template.dup
            new_game_character.template = false
            new_game_character.games_id = game.id
            new_game_character.save!
            # assign starter equipment depending on vocation
            VOCATION_STARTING_INVENTORIES[new_game_character.vocation.name].each do |item|
                Inventory.find_or_create_by!({ 
                    attachable: new_game_character, 
                    item: Item.find_by(name: item[:name], template: true),
                    equipped: item[:equipped],
                    active: true
                })
            end
          end
        end
        render json: game, status: :ok 
    else
        render json: { error: "Too many active save games, please delete 1 to start more games" }, status: :not_acceptable
    end
  end

  def resume_adventure
    @game.update(game_state: "game")
    render json: @game, status: :ok 
  end

  def delete_game
    @game.update(active: false)
    render json: { message: "Game deleted successfully" }, status: :ok
  end

  # def load_game_data
  #   render json: @game.as_json(include: :setting), status: :ok
  # end
  
  def find_character_template_by_vocation
    vocation_template = Character.find_by(vocation: params[:vocation_id], template: true)
    response_json = vocation_template.attributes.merge({
      vocation_abilities: VocationAbility.includes(ability: :element).where(vocation: vocation_template)
    })
    render json: response_json.as_json(include: [ability: {include: :element}]), status: :ok
  end

  def list_available_characters
    available_characters = Character.includes(:race, :visual_render, vocation: :icon, element: :visual_render).where(games_id: @game.id, party_id: nil)
    render json: available_characters.as_json(include: [:race, :visual_render, vocation: {include: :icon}, element: {include: :visual_render}]), status: :ok
  end
  
  def list_available_characters_new
    # verify that playerId owns the game id
    game = Game.find_by(id: params[:game_id], active: true, player_id: params[:player_id])
    unless game
      render json: { error: "Game not found or already deleted" }, status: :not_found
    end

    # create new character if there are less than 12 characters for the game
    game_characters = Character.where(games_id: game.id)

    # TODO, validate attribute point totals? nah, players can cheat if they like

    if game_characters.count <= 12
      new_character = nil
      ActiveRecord::Base.transaction do
        new_character = Character.new(
          name: params[:name],
          vocation_id: params[:vocation_id],
          race_id: params[:race_id],
          visual_render_id: params[:visual_render_id],
          element_id: params[:element_id],
          level: 1,
          experience_points: 0,
          hit_points: params[:hit_points],
          power_points: params[:power_points],
          max_hit_points: params[:max_hit_points],
          max_power_points: params[:max_power_points],
          strength: params[:strength],
          dexterity: params[:dexterity],
          constitution: params[:constitution],
          intelligence: params[:intelligence],
          wisdom: params[:wisdom],
          charisma: params[:charisma],
          template: false,
          games_id: game.id,
          description: params[:description]
        )
        new_character.save!
        # assign starter equipment depending on vocation
        vocation = new_character.vocation
        VOCATION_STARTING_INVENTORIES[vocation.name].each do |item|
            Inventory.find_or_create_by!({ 
                attachable: new_character, 
                item: Item.find_by(name: item[:name], template: true),
                equipped: item[:equipped] 
            })
        end
      end
      render json: new_character, status: :ok 
    else
      render json: { error: "Character limit reached, please remove any characters in roster to create more." }, status: :not_acceptable
    end
  end

  def player_party
    party = Party.includes(
      inventories: :item,
      characters: [
        :race,
        :visual_render,
        { inventories: { item: [:visual_render, :element, :equippable_slot] } },
        { vocation: [:icon, vocation_abilities: :ability] },
        { element: :visual_render }
      ]
    ).find_by(game_id: @game.id, player_party: true)

    render json: party.as_json(
      include: {
        filtered_inventories: {
          include: {
            item: {}
          }
        },
        characters: {
          include: {
            race: {},
            visual_render: {},
            filtered_inventories: {
              include: {
                item: {
                  include: [:visual_render, :element, :equippable_slot]
                }
              }
            },
            vocation: { include: [:icon, vocation_abilities: {include: :ability}] },
            element: { include: :visual_render }
          }
        }
      }
    ), status: :ok
  end

  def player_party_character_add
    party = Party.find_by('game_id': @game.id, player_party: true)
    party_characters = Character.where(games_id: @game.id, party_id: party.id)

    if party_characters.count < 4 
      character_to_add = Character.find_by(id: params[:character_id], games_id: @game.id)

      character_to_add.update(party_id: party.id, party_position_row: params[:target_position_row], party_position_column: params[:target_position_column])

      player_party
    else
      render json: { error: "Party size limit reached, please remove any characters in party to add more." }, status: :not_acceptable
    end
  end

  def player_party_character_remove
    character_to_remove = Character.find_by(id: params[:character_id], games_id: @game.id)
    character_to_remove.update(party_id: nil, party_position_row: nil, party_position_column: nil)

    player_party
  end

  def player_party_character_swap_position
    party = Party.find_by('game_id': @game.id, player_party: true)
    source_character = Character.find_by(id: params[:character_id], party_id: party.id)
    target_character = Character.find_by(party_position_row: params[:target_position_row], party_position_column: params[:target_position_column], party_id: party.id)
    source_position_row = source_character.party_position_row
    source_position_column = source_character.party_position_column
    ActiveRecord::Base.transaction do
      target_character.update(party_position_row: nil, party_position_column: nil) if target_character # to work around uniqueness validation
      source_character.update(party_position_row: params[:target_position_row], party_position_column: params[:target_position_column])
      target_character.update(party_position_row: source_position_row, party_position_column: source_position_column) if target_character
    end
    player_party
  end

  def get_character_portraits
    character_portraits = VisualRender.where(visual_type: "character")
    render json: character_portraits, status: :ok 
  end

  def get_vocations
    vocations = Vocation.includes(:icon).all
    render json: vocations.as_json(include: :icon), status: :ok
  end

  def get_elements
    elements = Element.includes(:visual_render).where(element_type: "base")
    render json: elements.as_json(include: :visual_render), status: :ok
  end

  def get_races
    races = Race.all
    render json: races, status: :ok 
  end

  def current_map
    party = Party.find_by(game_id: @game.id, player_party: true)
    render json: party.current_map, status: :ok
  end

  def player_party_turn
    party = Party.find_by(game_id: @game.id, player_party: true)
    party.update(facing_direction: params[:direction])
    render json: party, status: :ok
  end

  def player_party_move
    party = Party.find_by(game_id: @game.id, player_party: true)
    party.update(position: params[:position])
    
    ActiveRecord::Base.transaction do
      if Encounters.step(party)
        set_up_battle(party)
        party.update(status: "combat")
      end
    end
    
    render json: party, status: :ok
  end

  def move_item
    party = Party.find_by(game_id: @game.id, player_party: true)
    inventory_item = Inventory.find(params[:inventory_id])
    character = Character.find(params[:character_id]) if params[:character_id]

    return json_error("Incorrect game id.") unless party.game_id == @game.id
    return json_error("Inactive item.") unless inventory_item&.active?

    if character
      inventory_item.update(attachable: character)
    else 
      inventory_item.update(attachable: party)
    end

    player_party
  end

  def use_item
    party = Party.find_by(game_id: @game.id, player_party: true)
    inventory_item = Inventory.find(params[:inventory_id])
    character = Character.find(params[:character_id]) if params[:character_id]

    return json_error("Incorrect game id.") unless party.game_id == @game.id
    return json_error("Inactive item.") unless inventory_item&.active?

    events = []

    ActiveRecord::Base.transaction do
      inventory_item.item.item_effects.each do |item_effect|
        events.push(ItemActions.execute(item_effect.effect.effect_key, inventory_item: inventory_item, target: character, item_effect: item_effect));
      end
      inventory_item.update(active: false);
    end

    render json: events, status: :ok
  end

  def equip_item
    party = Party.find_by(game_id: @game.id, player_party: true)
    inventory_item = Inventory.find(params[:inventory_id])
    character = Character.find(params[:character_id]) if params[:character_id]

    return json_error("Incorrect game id.") unless party.game_id == @game.id
    return json_error("Inactive item.") unless inventory_item&.active?

    if (inventory_item.item.equippable_slot)
      if (inventory_item.equipped?)
        inventory_item.update(equipped: false)
      elsif (character)
        inventory_item.update(equipped: true, attachable: character)
      else
        inventory_item.update(equipped: true)
      end
    end

    player_party
  end

  def discard_item
    party = Party.find_by(game_id: @game.id, player_party: true)
    inventory_item = Inventory.find(params[:inventory_id])

    return json_error("Incorrect game id.") unless party.game_id == @game.id
    return json_error("Inactive item.") unless inventory_item&.active?

    if (inventory_item)
      inventory_item.update(active: false);
    end

    player_party
  end
  
  def use_character_ability
    party = Party.find_by(game_id: @game.id, player_party: true)
    character = Character.find(params[:character_id])

    render json: party, status: :ok
  end

  def combat_info
    party = Party.find_by(game_id: @game.id, player_party: true)
    battle = party.battle

    info = {
      enemies: Character.includes(:race,
        :visual_render,
        { vocation: [:icon, vocation_abilities: :ability] },
        { element: :visual_render }
      ).where(id: BattleEnemy.where(battle: battle).pluck(:character_id)),
      rewards: battle.inventories.includes(:item),
      dropped_wealth: battle.dropped_wealth,
      experience_gain: battle.experience_gain,
      round: battle.round,
      current_turn_character_id: battle.current_turn_character_id,
      turn_order: battle.turn_order
    }

    render json: {
      enemies: info[:enemies].as_json(
        include: {
          race: {},
          visual_render: {},
          vocation: {
            include: [:icon, { vocation_abilities: { include: :ability } }]
          },
          element: { include: :visual_render }
        }
      ),
      rewards: info[:rewards].as_json(include: :item),
      dropped_wealth: info[:dropped_wealth],
      experience_gain: info[:experience_gain],
      round: info[:round],
      current_turn_character_id: info[:current_turn_character_id],
      turn_order: JSON.parse(info[:turn_order])
    }, status: :ok
  end

  def combat_use_ability
    party = Party.find_by(game_id: @game.id, player_party: true)
    ability = Ability.find(params[:ability_id])
    current_turn_charcter = Character.find(party.battle.current_turn_character_id)
    target_character = Character.find(params[:character_id]) if params[:character_id]

    return json_error("Incorrect game id.") unless party.game_id == @game.id
    return json_error("Unavailable action.") unless current_turn_charcter.vocation.abilities.find(params[:ability_id])

    events = []

    ActiveRecord::Base.transaction do
      # ability.item_effects.each do |item_effect|
      #   events.push(CharacterActions.execute(item_effect.effect.effect_key, inventory_item: inventory_item, target: target_character, item_effect: item_effect));
      # end
      # inventory_item.update(active: false);

      # CharacterActions.execute(ability, source: current_turn_charcter, target: target_character, combat: true)
    end

    render json: events, status: :ok
  end

  private

  def find_player_game
    @game = Game.includes(:setting).find_by(id: params[:id], active: true, player_id: params[:player_id])
    unless @game
      render json: { error: "Game not found or already deleted" }, status: :not_found
    end
  end

  def find_starting_position(game)
    starting_position = nil
    starting_map = game.campaign.starting_map
    starting_map.detail.each_with_index do |row, row_idx|
      row.each_with_index do |cell, col_idx|
        if cell == "S"
          starting_position = [col_idx, row_idx]
          break
        end
      end
      break if starting_position
    end
    starting_position
  end

  def set_up_battle(party)
    set_up_enemies(party)
    # set up turn order
    battle_enemies = Character.where(id: BattleEnemy.where(battle: party.battle).pluck(:character_id).compact)
    characters_in_battle = battle_enemies + party.characters
    turn_order = characters_in_battle.pluck(:id).shuffle
    party.battle.update(dropped_wealth: 0, experience_gain: 0, round: 1, turn_order: turn_order.to_s, current_turn_character_id: turn_order.first)
  end

  def set_up_enemies(party)
    # clear previous enemies
    BattleEnemy.where(battle: party.battle).each do |old_battle_enemy|
      old_battle_enemy.destroy
    end

    monster_templates = Character.where(template: true).where.not(threat: nil)
    inverse_weights = monster_templates.map { |r| 1.0 / r.threat }
    total_weight = inverse_weights.sum
    
    ActiveRecord::Base.transaction do
      rand(1..4).times do |i|
        random_point = rand * total_weight
        running_sum = 0.0

        monster_templates.zip(inverse_weights).each do |record, inverse_weight|
          running_sum += inverse_weight
          if running_sum >= random_point
            clone_monster_template_for_battle(record, party)
            break
          end
        end
      end
    end
  end

  def clone_monster_template_for_battle(mosnter_template, party)
    new_monster = mosnter_template.dup
    new_monster.template = false
    new_monster.games_id = party.game.id
    new_monster.save!
    battle_enemy = BattleEnemy.new(battle: party.battle, character: new_monster)
    battle_enemy.save!
  end
end