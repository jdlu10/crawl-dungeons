class Battle < ApplicationRecord
  belongs_to :party

  has_many :inventories, as: :attachable
  has_many :battle_enemies

  def next_turn(events)
    current_turn_charcter_in_turn_order = a_turn_order.index(current_turn_character_id)
    next_character_index_in_turn_order = (current_turn_charcter_in_turn_order + 1) % a_turn_order.length
    self.current_turn_character_id = a_turn_order[next_character_index_in_turn_order]
    self.round += 1 if next_character_index_in_turn_order.zero?
    save!

    return next_turn(events) if Character.find(self.current_turn_character_id).dead?

    next_turn_is_enemy = self.battle_enemies.find { |be| be.character.id == self.current_turn_character_id }
    handle_monster_turn(events) if next_turn_is_enemy.present?
    events
  end

  def add_reward

  end

  def rewards
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

  private

  def a_turn_order
    JSON.parse(turn_order)
  end
end
