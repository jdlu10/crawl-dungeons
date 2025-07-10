import React, { useEffect } from "react";
import { useAppStore } from "../store/AppStore";
import MainMenu from "./MainMenu/main-menu";
import PartyFormation from "./PartyFormation/PartyFormation";

export default function Main() {
  const { setPlayerId, game } = useAppStore();
  // const setPlayerId = useAppStore((state) => state.setPlayerId);
  // const gameState = useAppStore((state) => state.gameState);

  useEffect(() => {
    setPlayerId(1); // Set a default player ID, replace with actual logic to get player ID
  }, []);

  const renderGame = () => {
    switch (game.gameState) {
      case "main-menu":
        return <MainMenu />;
      case "character-creation":
        return <PartyFormation />;
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
