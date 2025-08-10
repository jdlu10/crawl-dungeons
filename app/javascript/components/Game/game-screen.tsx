import React, { useEffect, useState } from "react";
import { useCurrentPartyFrame } from "./Party/CurrentPartyFrame";
import { useMiniMap } from "./Hud/MiniMap";
import GameViewport from "./Hud/GameViewport";
import MovementControls from "./Hud/MovementControls";
import { useAppStore } from "../../store/AppStore";
import CharacterPanel from "./Hud/CharacterPanel";
import { Character } from "../../types/CharacterTypes";

type GameState = "exploring" | "combat" | undefined;

export default function GameScreen() {
  const game = useAppStore((state) => state.game);
  const [gameScreenState, setGameScreenState] = useState<GameState>();
  const [characterSheet, setCharacterSheet] = useState<Character | undefined>();

  const { MiniMap } = useMiniMap();

  const { CurrentPartyFrame } = useCurrentPartyFrame({
    onClick: (character) => {
      setCharacterSheet(character);
    },
    innerFrameStyle: "w-24 h-24",
    additionalElements: (character) => (
      <>
        <div
          className="party-frame-character-hp w-2 h-24 border-t-2 border-r-2 border-b-2 border-l-0 border-gray-400 bg-red-950 relative"
          title={`HP: ${character.hit_points} / ${character.max_hit_points}`}
        >
          <div
            className="hp-bar status-bar block w-full bg-red-800 absolute bottom-0"
            style={{
              height:
                Math.floor(
                  (character.hit_points / character.max_hit_points) * 100
                ) + "%",
            }}
          ></div>
        </div>
        <div
          className="party-frame-character-pp w-2 h-24 border-t-2 border-r-2 border-b-2 border-l-0 border-gray-400 bg-blue-950 relative"
          title={`PP: ${character.power_points} / ${character.max_power_points}`}
        >
          <div
            className="hp-bar status-bar block w-full bg-blue-800 absolute bottom-0"
            style={{
              height:
                Math.floor(
                  (character.power_points / character.max_power_points) * 100
                ) + "%",
            }}
          ></div>
        </div>
        <div
          className="party-frame-character-xp w-2 h-24 border-t-2 border-r-2 border-b-2 border-l-0 border-gray-400 bg-yellow-950 relative"
          title={`XP: ${character.experience_points} / 10000`}
        >
          <div
            className="hp-bar status-bar block w-full bg-yellow-800 absolute bottom-0"
            style={{
              height:
                Math.floor((character.experience_points / 10000) * 100) + "%",
            }}
          ></div>
        </div>
      </>
    ),
  });

  useEffect(() => {
    if (game.gameState === "game") {
      setGameScreenState("exploring");
    } else if (game.gameState === "battle") {
      setGameScreenState("combat");
    }
  }, []);

  return (
    <div className="bg-gray-800 h-150 border-3 border-black rounded-lg shadow-md text-gray-300 mx-auto w-full max-w-6xl max-h-150 relative">
      <section className="viewport-container absolute top-0 right-0 left-0 bottom-0 bg-black flex justify-center overflow-hidden">
        <GameViewport />
      </section>
      {gameScreenState === "exploring" && (
        <section className="p-5 absolute inset-0 grid grid-rows-6 grid-cols-12">
          <div className="minimap row-start-1 col-start-11 col-span-2 row-span-2">
            <MiniMap />
          </div>
          <div className="movement row-start-1 col-start-3 col-span-8 row-span-3">
            <MovementControls />
          </div>
          <div className="party-frame row-start-4 row-span-3 col-start-4 col-span-6 justify-items-center content-end">
            <CurrentPartyFrame />
          </div>
        </section>
      )}
      {gameScreenState === "combat" && (
        <section className="p-5 absolute inset-0 grid grid-rows-6 grid-cols-12"></section>
      )}
      {characterSheet && (
        <CharacterPanel
          character={characterSheet}
          closeButtonHandler={setCharacterSheet}
        />
      )}
    </div>
  );
}
