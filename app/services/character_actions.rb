module CharacterActions
  extend self

  # Public method to run an action by name
  def execute(action_name, actor:, target:, **kwargs)
    method_name = action_name.to_s.underscore

    if respond_to?(method_name, true)
      send(method_name, actor, target, **kwargs)
    else
      raise ArgumentError, "Unknown action: #{action_name}"
    end
  end

  private

  # Example effect: Weapon attack
  def weapon_attack(actor, target, damage: nil)
    damage ||= calculate_damage(actor)
    target.hp -= damage
    target.save!
    { message: "#{actor.name} hits #{target.name} for #{damage} damage!" }
  end

  # Example effect: Heal
  def heal(actor, target, amount: nil)
    amount ||= calculate_heal(actor)
    target.hp += amount
    target.hp = [target.hp, target.max_hp].min
    target.save!
    { message: "#{actor.name} heals #{target.name} for #{amount} HP!" }
  end

  # Example helper methods
  def calculate_damage(actor)
    rand(5..10) + actor.strength
  end

  def calculate_heal(actor)
    rand(4..8) + actor.intelligence
  end
end