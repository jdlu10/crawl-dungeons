import { Character } from "./CharacterTypes";

export type Game = {
  id: number;
  campaign_id: number;
  player_id: number;
  active: boolean;
  updated_at: string;
  game_state:
    | "main-menu"
    | "character-creation"
    | "game"
    | "battle"
    | "settings"
    | "error";
};

export type Party = {
  characters: Character[];
};
