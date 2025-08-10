import { create } from "zustand";
import {
  FacingDirections,
  GameSetting,
  Party,
  PartyCoordinates,
  TypeMap,
} from "../types/GameTypes";

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
  },
}));
