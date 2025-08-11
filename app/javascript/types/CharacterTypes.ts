export type CharacterBase = {
  id: number;
  name: string;
  vocation_id: number;
  race_id: number;
  party_id: number;
  party_position_row: number;
  party_position_column: number;
  visual_render_id: number;
  element_id: number;
  level: number;
  experience_points: number;
  hit_points: number;
  max_hit_points: number;
  power_points: number;
  max_power_points: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  template: boolean;
  games_id: number;
  description: string;
};

export type Character = CharacterBase & {
  element: TypeElement;
  race: Race;
  vocation: Vocation;
  visual_render: VisualRender;
  filtered_inventories: Inventory[];
};

export const abilityScoreKeys = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;

export type TAbilityScoreKey = (typeof abilityScoreKeys)[number];
export type CharacterForm = CharacterBase & {
  game_id: number | undefined;
  player_id: number | undefined;
};

export type CharacterTemplateWithSkills = CharacterBase & {
  vocation_abilities: VocationAbility[];
};

export type TypeElement = {
  id: number;
  name: string;
  key: string;
  element_type: string;
  description: string;
  visual_render: VisualRender;
};

export type Race = {
  id: number;
  name: string;
  key: string;
};

export type Vocation = {
  id: number;
  name: string;
  vocation_type: string;
  icon: VisualRender;
  description: string;
  vocation_abilities: VocationAbility[];
};

export type VisualRender = {
  id: number;
  name: string;
  render: string;
  visual_type: string;
  url: string;
};

export type VocationAbility = {
  id: number;
  vocation_id: number;
  ability_id: number;
  ability: Ability;
};

export type Ability = {
  id: 1;
  passive: boolean;
  name: string;
  cost: number;
  ability_type: string;
  potency: number;
  range: number;
  level: number;
  group: string;
  element_id: number;
  created_at: string;
  updated_at: string;
  icon_id: number;
  level_requirement: number;
  description: string;
  key: string;
  element: TypeElement;
  usable_outside_combat: boolean | undefined;
};

export type PartyPosition = {
  row: number;
  col: number;
};

type PartyPositionsRow = [number, number, number];
export type PartyPositions = [PartyPositionsRow, PartyPositionsRow];

export type Inventory = {
  id: number;
  attachable_type: string;
  attachable_id: number;
  equipped: boolean;
  item: Item;
};

export type Item = {
  id: number;
  name: string;
  notes: string;
  valuable: boolean;
  usable: boolean;
  worth: number;
  attack_value: [number, number];
  defensive_value: [number, number];
  potency: number;
  template: boolean;
  description: string;
  twohanded: boolean;
  rarity: number;
  visual_render: VisualRender;
  element: Element;
  equippable_slot: EquippableSlot;
};

export type EquippableSlot = {
  id: number;
  key: string;
  name: string;
};
