class Api::V1::GamesController < ApplicationController
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
    :move_item_to_character,
    :move_item_to_party,
    :use_item_in_party_inventory,
    :equip_item_for_character,
    :use_item_in_character_inventory,
    :use_character_ability
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

          party = Party.new(game: game, name: "Player Party")
          party.current_map = game.campaign.starting_map
          party.position = game.campaign.starting_map.starting_position
          party.facing_direction = "N"
          party.position = find_starting_position(game)
          party.wealth = 0
          party.player_party = true
          party.save!
          # duplicate all character templates and save it with the new game
          Character.where(template: true).each do |character_template|
            new_game_character = character_template.dup
            new_game_character.template = false
            new_game_character.games_id = game.id
            new_game_character.save!
            # assign starter equipment depending on vocation
            VOCATION_STARTING_INVENTORIES[new_game_character.vocation.name].each do |item|
                Inventory.find_or_create_by!({ 
                    attachable: new_game_character, 
                    item: Item.find_by(name: item[:name], template: true),
                    equipped: item[:equipped] 
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
        inventories: {
          include: {
            item: {}
          }
        },
        characters: {
          include: {
            race: {},
            visual_render: {},
            inventories: {
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
    render json: party, status: :ok
  end

  def move_item_to_character
  end

  def move_item_to_party
  end

  def use_item_in_party_inventory
  end

  def equip_item_for_character
  end

  def use_item_in_character_inventory
  end
  
  def use_character_ability
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
end