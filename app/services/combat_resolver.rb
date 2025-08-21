module CombatResolver
  extend self

  def weapon_attack(attacker, target)
    base_damage = attacker.strength
    weapon_bonus = 0
    if attack.getEquippedItem("right_hand_one")
      
    end

    defense = target.defense.to_i

    # super basic formula
    [base_damage + weapon_bonus - defense, 0].max
  end

  def skill_attack(attacker, ability, target)

  end

  def magic_attack(caster, ability, target)
    base_damage = caster.intelligence * ability.power
    resistance = target.magic_defense.to_i

    [base_damage - resistance, 0].max
  end

  def heal(caster, ability, target)
    caster.intelligence * ability.power
  end

  def cure(caster, ability, target)
    caster.intelligence * ability.power
  end
end