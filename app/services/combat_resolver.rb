module CombatResolver
  extend self

  def weapon_attack(attacker, target)
    base_damage = rand(1..[(attacker.strength / 10.0).ceil, 1].max)
    weapon_damage = 0
    equipped_weapon = attacker.getEquippedItem("right_hand_one")
    if equipped_weapon
      weapon_damage = rand(JSON.parse(equipped_weapon.item.attack_value)[0]..JSON.parse(equipped_weapon.item.attack_value)[1])
    end

    defense = target.getDefenseValue
    pivot = 10.0
    factor = pivot / (pivot + defense)

    hit = rand < 0.8

    if hit
      damage = [((base_damage + weapon_damage) * factor).round, 0].max

      target.update(hit_points: [target.hit_points - damage, 0].max)

      return damage
    else
      return 0
    end
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