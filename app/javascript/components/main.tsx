import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "../store/AppStore";
import MainMenu from "./MainMenu/main-menu";
import PartyPreparation from "./PartyPreparation/party-preparation";
import GameScreen from "./Game/game-screen";
import { useQueryGetCurrentParty } from "../utils/hooks/characterHooks";

export default function Main() {
  const game = useAppStore((s) => s.game);
  const playerId = useAppStore((s) => s.playerId);
  const party = useAppStore((s) => s.party);
  const battle = useAppStore((s) => s.battle);
  const setPlayerId = useAppStore((s) => s.setPlayerId);

  const {
    data: current_party,
    isLoading: isLoadingCurrentParty,
    isError: isErrorCurrentParty,
  } = useQueryGetCurrentParty({ gameId: game.id, playerId: playerId });

  useEffect(() => {
    setPlayerId(1); // Set a default player ID, replace with actual logic to get player ID
  }, []);

  // tracking changes to current party
  useEffect(() => {
    if (current_party) {
      party.setPartyData(current_party);
    }
  }, [current_party]);

  const renderGame = () => {
    switch (game.gameState) {
      case "main-menu":
        return <MainMenu />;
      case "party-preparation":
        return <PartyPreparation />;
      case "game":
        return <GameScreen />;
      case "settings":
        return <div>Settings Component</div>;
      case "error":
        return <div>Error Component</div>;
      default:
        return <MainMenu />;
    }
  };

  function Debugger({ children }: { children: ReactNode }) {
    const debuggerContainer = document.getElementById("debugging");
    if (!debuggerContainer) return null;

    return createPortal(children, debuggerContainer);
  }

  return (
    <>
      {renderGame()}
      <Debugger>
        <pre>
          {JSON.stringify(party, null, 2)}
          {JSON.stringify(battle, null, 2)}
        </pre>
      </Debugger>
    </>
  );
}
