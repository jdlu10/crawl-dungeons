module GameEvents
  extend self

  # Public method to run an action by name
  def event(event_name, source_entity:, target_entities:, event_type:, **kwargs)
    method_name = event_name.parameterize(separator: "_")

    if respond_to?(method_name, true)
        send(method_name, source_entity, target_entities, event_type, **kwargs)
    else
        raise ArgumentError, "Unknown event: #{event_name}"
    end
  end

  private

  def use_item(source_entity, target_entities, event_type, value: nil, verb: nil, units: nil, description: nil)
    {
        action: "use_item",
        source_entity: source_entity,
        target_entities: target_entities,
        event_type: event_type,
        value: value,
        verb: verb,
        units: units,
        description: description,
        played: false
    }
  end

  def weapon_attack(source_entity, target_entities, event_type, value: nil, verb: nil, units: nil, description: nil)
    {
        action: "weapon_attack",
        source_entity: source_entity,
        target_entities: target_entities,
        event_type: event_type,
        value: value,
        verb: verb,
        units: units,
        description: description,
        played: false
    }
  end

  def use_skill(source_entity, target_entities, event_type, value: nil, verb: nil, units: nil, description: nil)
    {
        action: "use_skill",
        source_entity: source_entity,
        target_entities: target_entities,
        event_type: event_type,
        value: value,
        verb: verb,
        units: units,
        description: description,
        played: false
    }
  end

  def use_magic(source_entity, target_entities, event_type, value: nil, verb: nil, units: nil, description: nil)
    {
        action: "use_magic",
        source_entity: source_entity,
        target_entities: target_entities,
        event_type: event_type,
        value: value,
        verb: verb,
        units: units,
        description: description,
        played: false
    }
  end

  def maneuver(source_entity, target_entities, event_type, value: nil, verb: nil, units: nil, description: nil)
    {
        action: "maneuver",
        source_entity: source_entity,
        target_entities: target_entities,
        event_type: event_type,
        value: value,
        verb: verb,
        units: units,
        description: description,
        played: false
    }
  end

  def combat_message(source_entity, target_entities, event_type, value: nil, verb: nil, units: nil, description: nil)
    {
        action: "combat_message",
        source_entity: nil,
        target_entities: nil,
        event_type: event_type,
        value: nil,
        verb: verb,
        units: nil,
        description: description,
        played: false
    }
  end
end