import { create } from "zustand";
import {
  Command,
  FacingDirections,
  GameEvent,
  GameSetting,
  Party,
  PartyCoordinates,
  TypeMap,
  BattleStatus,
} from "../types/GameTypes";
import { Character, Inventory } from "../types/CharacterTypes";

type ThemeTypes = "light" | "dark" | "";
type gameStateTypes =
  | "main-menu"
  | "party-preparation"
  | "game"
  | "battle"
  | "settings"
  | "error";

type AppStore = {
  playerId?: number;
  playerName?: string;
  theme: ThemeTypes;
  setPlayerId: (playerId: number) => void;
  setTheme: (theme: ThemeTypes) => void;
  toggleTheme: () => void;
  game: {
    id: number | undefined;
    gameState: gameStateTypes;
    settings: GameSetting;
    setId: (id: number | undefined) => void;
    setGameState: (gameState: gameStateTypes) => void;
  };
  party: {
    data: Party | undefined;
    currentMap: TypeMap | undefined;
    setPartyData: (data: Party) => void;
    setCurrentMap: (currentMap: TypeMap) => void;
    setPartyFacing: (direction: FacingDirections) => void;
    setPartyPosition: (position: PartyCoordinates) => void;
    setPartyStatus: (status: "exploring" | "combat") => void;
  };
  battle: {
    targetMode: boolean;
    pending: boolean;
    events: GameEvent[];
    enemies: Character[];
    rewards: Inventory[];
    droppedWealth: number;
    experienceGain: number;
    round: number;
    currentTurnCharacterId: number;
    turnOrder: number[];
    currentAction: Command;
    currentActionTarget: Character | undefined;
    status: BattleStatus;
    setTargetMode: (targetMode: boolean) => void;
    setPending: (pending: boolean) => void;
    pushBattleEvent: (event: GameEvent) => void;
    setAllEventsToPlayed: () => void;
    setEnemies: (enemies: Character[]) => void;
    setRewards: (rewards: Inventory[]) => void;
    setDroppedWealth: (droppedWealth: number) => void;
    setExperienceGain: (experienceGain: number) => void;
    setRound: (round: number) => void;
    setCurrentTurnCharacterId: (characterId: number) => void;
    setTurnOrder: (turnOrder: number[]) => void;
    setCurrentAction: (currentAction: Command) => void;
    setCurrentActionTarget: (
      currentActionTarget: Character | undefined
    ) => void;
    setStatus: (status: BattleStatus) => void;
    resetCurrentAction: () => void;
  };
};

export const useAppStore = create<AppStore>((set) => ({
  theme: "",
  setPlayerId: (playerId) => {
    set(() => ({ playerId: playerId }));
  },
  setTheme: (theme) => {
    set(() => ({ theme: theme }));
  },
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }));
  },
  game: {
    id: undefined,
    gameState: "main-menu",
    settings: {
      movement_controls_hud: false,
    },
    setId: (id) => {
      set((state) => ({ game: { ...state.game, id } }));
    },
    setGameState: (gameState) => {
      set((state) => ({ game: { ...state.game, gameState } }));
    },
  },
  party: {
    data: undefined,
    currentMap: undefined,
    setPartyData: (data) => {
      set((state) => ({ party: { ...state.party, data } }));
    },
    setCurrentMap: (currentMap) => {
      set((state) => ({ party: { ...state.party, currentMap } }));
    },
    setPartyFacing: (direction: FacingDirections) => {
      set((state) => {
        if (state.party.data) {
          return {
            party: {
              ...state.party,
              data: {
                ...state.party?.data,
                facing_direction: direction,
              },
            },
          };
        } else {
          return { party: { ...state.party } };
        }
      });
    },
    setPartyPosition: (position: PartyCoordinates) => {
      set((state) => {
        if (state.party.data) {
          return {
            party: {
              ...state.party,
              data: {
                ...state.party?.data,
                position: position,
              },
            },
          };
        } else {
          return { party: { ...state.party } };
        }
      });
    },
    setPartyStatus: (status: "exploring" | "combat") => {
      set((state) => {
        if (state.party.data) {
          return {
            party: {
              ...state.party,
              data: {
                ...state.party?.data,
                status: status,
              },
            },
          };
        } else {
          return { party: { ...state.party } };
        }
      });
    },
  },
  battle: {
    targetMode: false,
    pending: false,
    events: [],
    enemies: [],
    rewards: [],
    droppedWealth: 0,
    experienceGain: 0,
    round: 0,
    currentTurnCharacterId: 0,
    turnOrder: [],
    currentAction: undefined,
    currentActionTarget: undefined,
    status: undefined,
    setTargetMode: (targetMode) => {
      set((state) => ({ battle: { ...state.battle, targetMode } }));
    },
    setPending: (pending) => {
      set((state) => ({ battle: { ...state.battle, pending } }));
    },
    pushBattleEvent: (event: GameEvent) => {
      set((state) => ({
        battle: {
          ...state.battle,
          events: [...state.battle.events, event], // new array each time
        },
      }));
    },
    setAllEventsToPlayed: () => {
      set((state) => ({
        battle: {
          ...state.battle,
          events: state.battle.events.map((event) => ({
            ...event,
            played: true,
          })),
        },
      }));
    },
    setEnemies: (enemies) => {
      set((state) => ({ battle: { ...state.battle, enemies } }));
    },
    setRewards: (rewards) => {
      set((state) => ({ battle: { ...state.battle, rewards } }));
    },
    setDroppedWealth: (droppedWealth) => {
      set((state) => ({ battle: { ...state.battle, droppedWealth } }));
    },
    setExperienceGain: (experienceGain) => {
      set((state) => ({ battle: { ...state.battle, experienceGain } }));
    },
    setRound: (round) => {
      set((state) => ({ battle: { ...state.battle, round } }));
    },
    setCurrentTurnCharacterId: (currentTurnCharacterId) => {
      set((state) => ({ battle: { ...state.battle, currentTurnCharacterId } }));
    },
    setTurnOrder: (turnOrder) => {
      set((state) => ({ battle: { ...state.battle, turnOrder } }));
    },
    setCurrentAction: (currentAction) => {
      set((state) => ({ battle: { ...state.battle, currentAction } }));
    },
    setCurrentActionTarget: (currentActionTarget) => {
      set((state) => ({ battle: { ...state.battle, currentActionTarget } }));
    },
    setStatus: (status) => {
      set((state) => ({ battle: { ...state.battle, status } }));
    },
    resetCurrentAction: () => {
      set((state) => ({
        battle: {
          ...state.battle,
          currentActionTarget: undefined,
          currentAction: undefined,
          targetMode: false,
          pending: false,
        },
      }));
    },
  },
}));
