module MonsterActions
  extend self

  def execute(enemy_character_name, enemy_character:, party:, **kwargs)
    method_name = enemy_character_name.parameterize(separator: "_")

    if respond_to?(method_name, true)
      send(method_name, enemy_character, party, **kwargs)
    else
      raise ArgumentError, "Unknown action: #{method_name}"
    end
  end

  private

  def goblin(enemy_character, party)
    target = party.characters.sample
    amount = enemy_character.strength
   
    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: "attacked",
      units: "hit points",
      description: "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    )
  end

  def slime(enemy_character, party)
    target = party.characters.sample
    amount = enemy_character.strength
   
    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: "attacked",
      units: "hit points",
      description: "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    )
  end

  def stone_golem(enemy_character, party)
    target = party.characters.sample
    amount = enemy_character.strength
   
    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: "attacked",
      units: "hit points",
      description: "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    )
  end

end