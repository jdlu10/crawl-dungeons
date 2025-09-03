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

      if target.has_status?("defending")
        damage = (damage / 2.0).round
      end

      return damage
    else
      return 0
    end
  end

  def skill_attack(attacker, ability, target)

  end

  def magic_attack(caster, ability, target)
    base_damage = (caster.intelligence / 5) + (rand(1..6) * ability.potency)
    resistance = target.wisdom / 5

    damage = [base_damage - resistance, 0].max

    target_character.update_hitpoints(-damage)

    apply_status_effects(ability, target)

    damage
  end

  def heal(caster, ability, target)
    amount = (caster.wisdom / 5) + (rand(1..6) * ability.potency)

    target_character.update_hitpoints(amount)

    amount
  end

  def cure(caster, ability, target)
    target.statuses.each do |status|
      if status.negative?
        target.statuses.destroy(status)
      end
    end
  end

  def apply_status_effects(ability, target)
    ability.effect_links.each do |effect_link|
      if rand > 0.6
        next
      end
      
      status = CharacterStatus.find_or_initialize_by(
        character: target,
        status: Status.find_by(key: effect_link.effect.effect_key),
      )

      status.update!(duration: rand(1..3))
    end
  end
end