import { Ability, Character, Inventory } from "./CharacterTypes";

export type Game = {
  id: number;
  campaign_id: number;
  player_id: number;
  active: boolean;
  updated_at: string;
  game_state:
    | "main-menu"
    | "party-preparation"
    | "game"
    | "battle"
    | "settings"
    | "error";
};

export type Party = {
  id: number | undefined;
  name: string;
  game_id: number;
  wealth: number;
  facing_direction: string;
  current_map_id: number;
  position: [x: number, y: number];
  status: "combat" | "exploring" | "victory" | "defeat";
  battles_id: number;
  player_party: boolean;
  filtered_inventories: Inventory[];
  characters: Character[];
  events: GameEvent[];
};

export type useQueryGetGameInfoParams = {
  gameId: number | undefined;
  playerId: number | undefined;
};

export type ElementName =
  | "element_fire"
  | "element_water"
  | "element_air"
  | "element_darkness"
  | "element_earth"
  | "element_ice"
  | "element_light"
  | "element_lightning"
  | "element_null"
  | "element_poison";

export type VocationName =
  | "vocation_warrior"
  | "vocation_vagabond"
  | "vocation_physician"
  | "vocation_scholar"
  | "vocation_guardian"
  | "vocation_ritualist"
  | "vocation_swordsman";

export type TypeMap = {
  id: number;
  name: string;
  tileset: string;
  notes: string;
  campaign_id: number;
  detail: string[][];
  level: number;
};

export const DIRECTIONS = ["N", "E", "S", "W"] as const;
export type FacingDirections = (typeof DIRECTIONS)[number];
export type MoveDirections = "forward" | "back" | "left" | "right";
export type PartyCoordinates = [number, number];

export type GameSetting = {
  movement_controls_hud: boolean;
};

export type GameEvent = {
  action:
    | "use_item"
    | "weapon_attack"
    | "use_magic"
    | "maneuver"
    | "use_skill"
    | "combat_message";
  sourceEntity: Character | undefined;
  targetEntities: Character[];
  eventType: string;
  value: number | undefined;
  verb: string | undefined;
  units: string | undefined;
  description: string | undefined;
  played: boolean;
};

export type BattleStatus = "victory" | "defeat" | undefined;

export type BattleInfo = {
  enemies: Character[];
  rewards: Inventory[];
  dropped_wealth: number;
  experience_gain: number;
  round: number;
  current_turn_character_id: number;
  turn_order: number[];
  status: BattleStatus;
};

export type Command =
  | { type: "ability"; command: Ability }
  | { type: "inventory"; command: Inventory }
  | undefined;
