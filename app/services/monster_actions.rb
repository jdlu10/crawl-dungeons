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
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def goblin_warrior(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def orc(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def skeleton(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def skeleton_warrior(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def zombie(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def ghost(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def wolf(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def imp(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def slime(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def stone_golem(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end

  def dragon(enemy_character, party)
    target = party.characters.sample
    amount = CombatResolver.weapon_attack(enemy_character, target)
    verb = "attacked"
    description = "#{enemy_character.name} attacked #{target.name} for #{amount} hit points!"
    if amount == 0
      verb = "missed"
      description = "#{enemy_character.name} attacked #{target.name} and missed!"
    end

    GameEvents.event(
      "physical_attack",
      source_entity: enemy_character,
      target_entities: [target],
      event_type: "enemy_action",
      value: amount,
      verb: verb,
      units: "hit points",
      description: description
    )
  end
end