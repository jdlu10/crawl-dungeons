class Battle < ApplicationRecord
  belongs_to :party

  has_many :inventories, as: :attachable
  has_many :battle_enemies

  def next_turn(events)
    return events if victory? || defeat?

    current_turn_character_in_turn_order = a_turn_order.index(current_turn_character_id)
    next_character_index_in_turn_order = (current_turn_character_in_turn_order + 1) % a_turn_order.length
    self.current_turn_character_id = a_turn_order[next_character_index_in_turn_order]
    self.round += 1 if next_character_index_in_turn_order.zero?
    save!

    current_turn_character = Character.find(self.current_turn_character_id)
    
    update_character_statuses(current_turn_character)

    return next_turn(events) if current_turn_character.dead?

    next_turn_is_enemy = self.battle_enemies.find { |be| be.character.id == self.current_turn_character_id }
    handle_monster_turn(events) if next_turn_is_enemy.present?
    events
  end

  def victory?
    self.battle_enemies.all? { |be| be.character.dead? }
  end

  def defeat?
    self.party.characters.all? { |c| c.dead? }
  end

  def handle_monster_turn(events)
    enemy_character = Character.find(self.current_turn_character_id)

    events.push(MonsterActions.execute(enemy_character.name, enemy_character: enemy_character, party: self.party));
    next_turn(events)
  end

  def reset
    update!(current_turn_character_id: 0, turn_order: [], round: 0, dropped_wealth: 0, experience_gain: 0)

    self.party.characters.each do |character|
      character.character_statuses.destroy_all
    end

    self.battle_enemies.each do |battle_enemy|
      battle_enemy.character.character_statuses.destroy_all
      battle_enemy.destroy
    end
  end

  private

  def a_turn_order
    JSON.parse(turn_order)
  end

  def update_character_statuses(current_turn_character)
    current_turn_character.character_statuses.each do |character_status|
      character_status.duration -= 1
      if character_status.duration <= 0
        character_status.destroy
      else
        character_status.save!
      end
    end
  end
end
