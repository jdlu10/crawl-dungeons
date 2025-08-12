module ItemEffects
  extend self

  # Public method to run an action by name
  def execute(action_name, item:, target:, **kwargs)
    return if !item.usable?
    item.item_effects.each do |item_effect|
        method_name = item_effect.effect.effect_key.to_s.underscore

        if respond_to?(method_name, true)
            send(method_name, item, target, item_effect, **kwargs)
        else
            raise ArgumentError, "Unknown action: #{action_name}"
        end
    end
  end

  private

  # Example effect: Weapon attack
  def curing(item, target, item_effect)
    # damage ||= calculate_damage(item)
    # target.hp -= damage
    # target.save!
    # { message: "#{item.name} hits #{target.name} for #{damage} damage!" }
    target.character_statuses.each do |character_statuses|
    end
  end

  # Example effect: Heal
  def healing(item, target, item_effect)
    amount ||= calculate_heal(item)
    target.hp += amount
    target.hp = [target.hp, target.max_hp].min
    target.save!
    { message: "#{item.name} heals #{target.name} for #{amount} HP!" }
  end

  # Example helper methods
  def calculate_damage(item)
    rand(5..10) + item.strength
  end

  def calculate_heal(item)
    rand(4..8) + item.intelligence
  end
end