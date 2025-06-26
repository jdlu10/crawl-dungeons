import { create } from "zustand";

type ThemeTypes = "light" | "dark" | "";

type AppStore = {
  theme: ThemeTypes;
  mode: "2D" | "3D";
  readability: boolean;
  setTheme: (theme: ThemeTypes) => void;
  toggleTheme: () => void;
  toggleMode: () => void;
  toggleReadability: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  theme: "",
  mode: "2D",
  readability: false,
  setTheme: (theme) => {
    set(() => ({ theme: theme }));
  },
  toggleTheme: () => {
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }));
  },
  toggleMode: () => {
    set((state) => ({ mode: state.mode === "2D" ? "3D" : "2D" }));
  },
  toggleReadability: () => {
    set((state) => ({
      readability: state.readability === true ? false : true,
    }));
  },
}));
