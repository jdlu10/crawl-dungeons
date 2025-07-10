import { create } from "zustand";

type ThemeTypes = "light" | "dark" | "";
type gameStateTypes =
  | "main-menu"
  | "character-creation"
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
    gameState: gameStateTypes;
    setGameState: (gameState: gameStateTypes) => void;
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
    gameState: "main-menu",
    setGameState: (gameState) => {
      set((state) => ({ game: { ...state.game, gameState } }));
    },
  },
}));
