module CharacterActions
  extend self

  def execute(method_name, ability:, current_turn_charcter:, target_character:, **kwargs)
    # check power point usage

    if respond_to?(method_name.parameterize(separator: "_"), true)
      send(method_name, ability, current_turn_charcter, target_character, **kwargs)
    else
      raise ArgumentError, "Unknown action: #{method_name}"
    end
  end

  private

  def weapon_attack(ability, current_turn_charcter, target_character)
    damage = CombatResolver.weapon_attack(current_turn_charcter, target_character)
    verb = "attacked"
    description = "#{current_turn_charcter.name} attacked #{target_character.name} for #{damage} hit points!"
    if damage == 0
      verb = "missed"
      description = "#{current_turn_charcter.name} attacked #{target_character.name} and missed!"
    else
      target_character.update_hitpoints(-damage)
    end

    [GameEvents.event(
      "weapon_attack",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: damage,
      verb: verb,
      units: "hit points",
      description: description
    )]
  end

  def defend(ability, current_turn_charcter, target_character)
    CharacterStatus.create!(
      character: current_turn_charcter,
      status: Status.find_by(key: "defending"),
      duration: 1,
    )

    [GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: 0,
      verb: "defends",
      units: "",
      description: "#{current_turn_charcter.name} put up a defensive stance!"
    )]
  end

  def flee(ability, current_turn_charcter, target_character)
    flee_result = "#{current_turn_charcter.name} orders the party to flee from combat but failed!"
    if rand < 0.4
      flee_result = "#{current_turn_charcter.name} orders the party to flee from combat!"
      current_turn_charcter.party.update(status: "exploring")
      current_turn_charcter.party.battle.reset
    end
    
    [GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: flee_result
    )]
  end

  def power_attack(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    damage = CombatResolver.weapon_attack(current_turn_charcter, target_character)
    damage = (damage * ability.potency).round
    verb = "used power attack on"
    description = "#{current_turn_charcter.name} used power attack on #{target_character.name} and hit for #{damage} hit points!"
    if damage == 0
      verb = "missed"
      description = "#{current_turn_charcter.name} used power attack on #{target_character.name} and missed!"
    else
      target_character.update_hitpoints(-damage)
    end

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "use_skill",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: damage,
      verb: verb,
      units: "hit points",
      description: description
    )]
  end

  def full_swing(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)
    
    events = []

    enemies = current_turn_charcter.party.battle.battle_enemies.map { |be| be.character }
    
    enemies.each do |enemy|
      damage = CombatResolver.weapon_attack(current_turn_charcter, enemy)
      damage = (damage * ability.potency).round
      verb = "used full swing on"
      description = "#{current_turn_charcter.name} used full swing on #{enemy.name} and hit for #{damage} hit points!"
      if damage == 0
        verb = "missed"
        description = "#{current_turn_charcter.name} used full swing on #{enemy.name} and missed!"
      else
        enemy.update_hitpoints(-damage)
      end

      events.push(GameEvents.event(
        "use_skill",
        source_entity: current_turn_charcter,
        target_entities: [enemy],
        event_type: ability.key,
        value: damage,
        verb: verb,
        units: "hit points",
        description: description
      ))
    end

    reduce_power_points(current_turn_charcter, ability)

    events
  end

  def hide(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)
    
    hidden_status = CharacterStatus.find_or_initialize_by(
      character: current_turn_charcter,
      status: Status.find_by(key: "hidden")
    )

    hidden_status.update!(duration: 3)

    [GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: 0,
      verb: "hides",
      units: "",
      description: "#{current_turn_charcter.name} hides in the shadows..."
    )]
  end

  def sneak_attack(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)
    return if !current_turn_charcter.has_status?("hidden")

    reduce_power_points(current_turn_charcter, ability)

    damage = CombatResolver.weapon_attack(current_turn_charcter, target_character)
    damage = (damage * ability.potency).round
    verb = "used sneak attack on"
    description = "#{current_turn_charcter.name} used sneak attack on #{target_character.name} and hit for #{damage} hit points!"
    if damage == 0
      verb = "missed"
      description = "#{current_turn_charcter.name} used sneak attack on #{target_character.name} and missed!"
    else
      target_character.update_hitpoints(-damage)
    end
    
    [GameEvents.event(
      "use_skill",
        source_entity: current_turn_charcter,
        target_entities: Array(target_character),
        event_type: ability.key,
        value: damage,
        verb: verb,
        units: "hit points",
        description: description
    )]
  end

  def steal(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)
    return if !current_turn_charcter.has_status?("hidden")

    reduce_power_points(current_turn_charcter, ability)

    success = rand < 0.3

    if success
      item_drop_quality_modifier = target_character.threat + target_character.level * 10
      treasure = Inventory.new(
        attachable: current_turn_charcter, item: Item.where(template: true).where("rarity >= ?", item_drop_quality_modifier).order("RANDOM()").first, equipped: false, active: true
      )
      treasure.save!

      description = "#{current_turn_charcter.name} stole #{treasure.item.name} from #{target_character.name}!"
    else
      description = "#{current_turn_charcter.name} tried to steal from #{target_character.name} and failed!"
    end
    
    [GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: 0,
      verb: "stole from",
      units: "",
      description: description
    )]
  end

  def fire_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)

    damage = CombatResolver.magic_attack(current_turn_charcter, ability, target_character)
    verb = "used fire bolt on"
    description = "#{current_turn_charcter.name} used fire bolt on #{target_character.name} and hit for #{damage} hit points!"
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: damage,
      verb: verb,
      units: "hit points",
      description: description
    )]
  end

  def water_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)

    damage = CombatResolver.magic_attack(current_turn_charcter, ability, target_character)
    verb = "used water bolt on"
    description = "#{current_turn_charcter.name} used water bolt on #{target_character.name} and hit for #{damage} hit points!"
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: damage,
      verb: verb,
      units: "hit points",
      description: description
    )]
  end

  def earth_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)

    damage = CombatResolver.magic_attack(current_turn_charcter, ability, target_character)
    verb = "used earth bolt on"
    description = "#{current_turn_charcter.name} used earth bolt on #{target_character.name} and hit for #{damage} hit points!"

    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: damage,
      verb: verb,
      units: "hit points",
      description: description
    )]
  end

  def lightning_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)

    damage = CombatResolver.magic_attack(current_turn_charcter, ability, target_character)
    verb = "used lightning bolt on"
    description = "#{current_turn_charcter.name} used lightning bolt on #{target_character.name} and hit for #{damage} hit points!"
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: damage,
      verb: verb,
      units: "hit points",
      description: description
    )]
  end

  def heal(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)

    amount = CombatResolver.heal(current_turn_charcter, ability, target_character)
    verb = "used heal on"
    description = "#{current_turn_charcter.name} used heal on #{target_character.name} and healed for #{amount} hit points!"
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: amount,
      verb: verb,
      units: "",
      description: description
    )]
  end

  def cure(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)

    CombatResolver.cure(current_turn_charcter, ability, target_character)
    verb = "used cure on"
    description = "#{current_turn_charcter.name} used cure on #{target_character.name}!"
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: Array(target_character),
      event_type: ability.key,
      value: 0,
      verb: verb,
      units: "",
      description: description
    )]
  end

  def unable_to_use_ability(actor, ability)
    actor.dead? || actor.power_points < ability.cost
  end

  def reduce_power_points(actor, ability)
    actor.update(power_points: [actor.power_points - ability.cost, 0].max)
  end
end