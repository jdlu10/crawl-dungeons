module ItemActions
  extend self

  def execute(action_name, inventory_item:, target:, effect_link:, **kwargs)
    return if !inventory_item.item.usable?

    method_name = effect_link.effect.effect_key.to_s.underscore

    if respond_to?(method_name, true)
      send(method_name, inventory_item, target, effect_link, **kwargs)
    else
      raise ArgumentError, "Unknown action: #{action_name}"
    end
  end

  private

  def curing(inventory_item, target, effect_link)
    target.character_statuses.each do |character_statuses|
    end
  end

  def healing(inventory_item, target, effect_link)
    item = inventory_item.item
    amount ||= calculate_heal(item)
    target.update(hit_points: [target.max_hit_points, target.hit_points + amount].min)
    
    GameEvents.event(
      "use_item",
      source_entity: inventory_item.attachable,
      target_entities: [target],
      event_type: "healing",
      value: amount,
      verb: "healed",
      units: "hit points",
      description: "#{item.name} healed #{target.name} for #{amount} hit points!"
    )
  end

  def calculate_heal(item)
    heal_range = JSON.parse(item.attack_value)
    rand(heal_range[0]..heal_range[1])
  end
end