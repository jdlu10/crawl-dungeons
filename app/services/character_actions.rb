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
      target_character.update(hit_points: [target_character.hit_points - damage, 0].max)
    end

    [GameEvents.event(
      "weapon_attack",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
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
      target_entities: [target_character],
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
      target_entities: [target_character],
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
      target_character.update(hit_points: [target_character.hit_points - damage, 0].max)
    end

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "use_skill",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
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
        enemy.update(hit_points: [enemy.hit_points - damage, 0].max)
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
      target_entities: [target_character],
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
    
    [GameEvents.event(
      "use_skill",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def steal(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)
    return if !current_turn_charcter.has_status?("hidden")

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def fire_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def water_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def earth_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)

    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def lightning_bolt(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def heal(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def cure(ability, current_turn_charcter, target_character)
    return if unable_to_use_ability(current_turn_charcter, ability)

    reduce_power_points(current_turn_charcter, ability)
    
    [GameEvents.event(
      "use_magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )]
  end

  def unable_to_use_ability(actor, ability)
    actor.dead? || actor.power_points < ability.cost
  end

  def reduce_power_points(actor, ability)
    actor.update(power_points: [actor.power_points - ability.cost, 0].max)
  end
end