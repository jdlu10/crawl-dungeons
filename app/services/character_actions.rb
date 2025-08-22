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
    amount = CombatResolver.weapon_attack(current_turn_charcter, target_character)
    verb = "attacked"
    description = "#{current_turn_charcter.name} attacked #{target_character.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{current_turn_charcter.name} attacked #{target_character.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def defend(ability, current_turn_charcter, target_character)


    GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "defends",
      units: "",
      description: "#{current_turn_charcter.name} put up a defensive stance!"
    )
  end

  def flee(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def power_attack(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "physical_attack",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def full_swing(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "physical_attack",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def hide(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def sneak_attack(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "physical_attack",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def steal(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "maneuver",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def fire_bolt(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def water_bolt(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def earth_bolt(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def lightning_bolt(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def heal(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end

  def cure(ability, current_turn_charcter, target_character)

    
    GameEvents.event(
      "magic",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: 0,
      verb: "flees",
      units: "",
      description: "#{current_turn_charcter.name} orders the party to flee from combat!"
    )
  end
end