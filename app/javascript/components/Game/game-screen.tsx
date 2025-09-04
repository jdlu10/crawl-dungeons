import React, { useEffect, useRef, useState } from "react";
import { useCurrentPartyFrame } from "./Party/CurrentPartyFrame";
import { useMiniMap } from "./Hud/MiniMap";
import GameViewport from "./Hud/GameViewport";
import MovementControls from "./Hud/MovementControls";
import { useAppStore } from "../../store/AppStore";
import CharacterPanel from "./Hud/CharacterPanel";
import { Party } from "../../types/GameTypes";
import { useQueryLoadCombatInfo } from "../../utils/hooks/combatHooks";
import Enemies from "./Battle/Enemies";
import BattleCommands from "./Battle/BattleCommands";
import TurnOrder from "./Battle/TurnOrder";
import BattleEvents from "./Battle/BattleEvents";
import BattleAnimations from "./Battle/BattleAnimations";
import Rewards from "./Battle/Rewards";
import { useInvalidateQueries } from "../../utils/hooks/queryHooks";

type GameState = "exploring" | "combat" | "victory" | "defeat" | undefined;

export default function GameScreen() {
  const game = useAppStore((s) => s.game);
  const playerId = useAppStore((s) => s.playerId);
  const battle = useAppStore((s) => s.battle);
  const partyData = useAppStore<Party | undefined>((state) => state.party.data);
  const resetBattle = useAppStore((s) => s.battle.resetBattle);
  const setCurrentActionTarget = useAppStore(
    (s) => s.battle.setCurrentActionTarget
  );
  const resetCurrentAction = useAppStore(
    (state) => state.battle.resetCurrentAction
  );

  const enemyGraphicAnchors = useRef<{
    anchors: React.RefObject<HTMLButtonElement>[];
  }>(null);
  const partyPortraitAnchors = useRef<{
    anchors: React.RefObject<HTMLDivElement>[];
  }>(null);

  const [gameScreenState, setGameScreenState] =
    useState<GameState>("exploring");
  const [characterSheetId, setCharacterSheetId] = useState<
    number | undefined
  >();

  const {
    data: battleInfo,
    isLoading: isLoadingCombatInfo,
    isError: isErrorCombatInfo,
  } = useQueryLoadCombatInfo({
    gameId: game.id,
    playerId: playerId,
    combat: gameScreenState,
  });

  const { invalidateCombatInfo } = useInvalidateQueries();

  const { MiniMap } = useMiniMap();

  const { CurrentPartyFrame } = useCurrentPartyFrame({
    onClick: (character) => {
      if (battle.targetMode) {
        setCurrentActionTarget(character);
      } else {
        setCharacterSheetId(character.id);
      }
    },
    innerFrameStyle: "w-24 h-24",
    additionalElements: (character) => (
      <>
        <div
          className={`party-frame-character-hp ${
            partyData?.status === "combat" ? "w-4" : "w-2"
          } h-24 border-t-2 border-r-2 border-b-2 border-l-0 border-gray-400 bg-red-950 relative status-bar`}
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
          className={`party-frame-character-pp ${
            partyData?.status === "combat" ? "w-4" : "w-2"
          } h-24 border-t-2 border-r-2 border-b-2 border-l-0 border-gray-400 bg-blue-950 relative status-bar`}
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
          className={`party-frame-character-xp ${
            partyData?.status === "combat" ? "w-4" : "w-2"
          } h-24 border-t-2 border-r-2 border-b-2 border-l-0 border-gray-400 bg-yellow-950 relative status-bar`}
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

  const Defeat = () => (
    <div
      className={`enemies w-full h-full p-2.5 flex flex-col gap-8 items-center justify-end`}
    >
      <p className="text-2xl">Your party has been defeated!</p>
    </div>
  );

  useEffect(() => {
    setGameScreenState(partyData?.status);
  }, [partyData?.status]);

  useEffect(() => {
    if (gameScreenState === "combat") {
      battle.pushBattleEvent({
        action: "combat_message",
        source_entity: undefined,
        target_entities: [],
        eventType: "",
        verb: "begin",
        description: "Battle commence!",
        played: false,
        value: undefined,
        units: undefined,
      });
      invalidateCombatInfo();
    } else if (gameScreenState === "exploring") {
      resetBattle();
    }
  }, [gameScreenState]);

  useEffect(() => {
    if (battleInfo) {
      battle.setEnemies(battleInfo.enemies);
      battle.setRewards(battleInfo.rewards);
      battle.setDroppedWealth(battleInfo.dropped_wealth);
      battle.setExperienceGain(battleInfo.experience_gain);
      battle.setRound(battleInfo.round);
      battle.setCurrentTurnCharacterId(battleInfo.current_turn_character_id);
      battle.setTurnOrder(battleInfo.turn_order);
      battle.setStatus(battleInfo.status);
    }
  }, [battleInfo]);

  return (
    <div className="bg-gray-800 h-150 border-3 border-black rounded-lg shadow-md text-gray-300 mx-auto w-full max-w-6xl max-h-150 relative">
      {battle.pending && (
        <div className="pending-modal absolute inset-0 z-50 bg-black opacity-0"></div>
      )}
      {battle.targetMode && (
        <>
          <div
            className="target-mode-modal absolute inset-0 bg-black opacity-50 z-10"
            onClick={resetCurrentAction}
          ></div>
          <div className="absolute border-2 border-gray-200 text-gray-200 font-bold top-[53%] left-1/2 -translate-1/2 px-4 py-2 text-2xl z-11">
            Choose a target
          </div>
        </>
      )}
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
      {(gameScreenState === "victory" || gameScreenState === "defeat") && (
        <section className="p-5 absolute inset-0 grid grid-rows-6 grid-cols-12">
          <div className="turn-order row-start-1 row-span-3 col-span-1 justify-items-left">
            <TurnOrder />
          </div>
          <div className="combat-screen row-start-1 row-span-3 col-start-2 col-span-10 justify-items-center">
            {gameScreenState === "victory" && <Rewards />}
            {gameScreenState === "defeat" && <Defeat />}
          </div>
          <div className="battle-commands row-start-4 row-span-3 col-start-2 col-span-2 justify-items-center content-end"></div>
          <div className="party-frame row-start-4 row-span-3 col-start-4 col-span-6 justify-items-center content-end">
            <CurrentPartyFrame />
          </div>
          <div className="battle-events row-start-4 row-span-3 col-start-10 col-span-3 justify-items-center content-end"></div>
        </section>
      )}
      {!characterSheetId && gameScreenState === "combat" && (
        <section className="p-5 absolute inset-0 grid grid-rows-6 grid-cols-12">
          <div className="turn-order row-start-1 row-span-3 col-span-1 justify-items-left">
            <TurnOrder />
          </div>
          <div className="combat-screen row-start-1 row-span-3 col-start-2 col-span-10 justify-items-center">
            <Enemies ref={enemyGraphicAnchors} />
          </div>
          <div className="battle-commands row-start-4 row-span-3 col-start-2 col-span-2 justify-items-center content-end">
            <BattleCommands />
          </div>
          <div className="party-frame row-start-4 row-span-3 col-start-4 col-span-6 justify-items-center content-end">
            <CurrentPartyFrame ref={partyPortraitAnchors} />
          </div>
          <div className="battle-events row-start-4 row-span-3 col-start-10 col-span-3 justify-items-center content-end">
            <BattleEvents />
          </div>
          <BattleAnimations
            enemyAnchors={enemyGraphicAnchors}
            partyPortraitAnchors={partyPortraitAnchors}
          />
        </section>
      )}
      {characterSheetId && (
        <CharacterPanel
          characterId={characterSheetId}
          setCharacterSheetId={setCharacterSheetId}
        />
      )}
    </div>
  );
}
