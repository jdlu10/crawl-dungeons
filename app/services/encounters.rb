module Encounters
  extend self

  # Call this each time the player takes a step
  def step(party)
    party.update(steps_since_last_encounter: (party.steps_since_last_encounter || 0) + 1)

    # 1. Early steps → no chance
    return false if party.steps_since_last_encounter < min_steps_before_encounter

    # 2. Force encounter after max steps
    if party.steps_since_last_encounter >= max_steps_before_forced_encounter
      reset_steps
      return true
    end

    # 3. Increasing probability per step after min threshold
    extra_steps = party.steps_since_last_encounter - min_steps_before_encounter + 1
    encounter_chance = base_chance * extra_steps

    if rand < encounter_chance
      reset_steps(party)
      return true
    end

    return false
  end

  private

  def reset_steps(party)
    party.update(steps_since_last_encounter: 0)
  end

  def min_steps_before_encounter
    3
  end

  def max_steps_before_forced_encounter
    15
  end

  def base_chance
    0.05
  end
end