import { create } from "zustand";

type ThemeTypes = "light" | "dark" | "";
type gameStateTypes = "main-menu" | "game" | "battle" | "settings" | "error";

type AppStore = {
  playerId?: number;
  playerName?: string;
  theme: ThemeTypes;
  gameState: gameStateTypes;
  setPlayerId: (playerId: number) => void;
  setTheme: (theme: ThemeTypes) => void;
  setGameState: (gameState: gameStateTypes) => void;
  toggleTheme: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  theme: "",
  gameState: "main-menu",
  setPlayerId: (playerId) => {
    set(() => ({ playerId: playerId }));
  },
  setTheme: (theme) => {
    set(() => ({ theme: theme }));
  },
  setGameState: (gameState) => {
    set(() => ({ gameState: gameState }));
  },
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }));
  },
  // toggleReadability: () => {
  //   set((state) => ({
  //     readability: state.readability === true ? false : true,
  //   }));
  // },
}));
