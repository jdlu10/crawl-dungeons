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
    amount = CombatResolver.weapon_attack(current_turn_charcter, ability, target_character)

    GameEvents.event(
      "physical_attack",
      source_entity: current_turn_charcter,
      target_entities: [target_character],
      event_type: ability.key,
      value: amount,
      verb: "attacked",
      units: "hit points",
      description: "#{current_turn_charcter.name} attacked #{target_character.name} for #{amount} hit points!"
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

end