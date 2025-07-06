import React, { useEffect } from "react";
import { useAppStore } from "../store/AppStore";
import MainMenu from "./MainMenu/main-menu";

export default function Main() {
  const setPlayerId = useAppStore((state) => state.setPlayerId);
  const gameState = useAppStore((state) => state.gameState);

  useEffect(() => {
    setPlayerId(1); // Set a default player ID, replace with actual logic to get player ID
  }, []);

  const renderGame = () => {
    switch (gameState) {
      case "main-menu":
        return <MainMenu />;
      case "game":
        return <div>Game Component</div>;
      case "battle":
        return <div>Battle Component</div>;
      case "settings":
        return <div>Settings Component</div>;
      case "error":
        return <div>Error Component</div>;
      default:
        return <MainMenu />;
    }
  };

  return <>{renderGame()}</>;
}
