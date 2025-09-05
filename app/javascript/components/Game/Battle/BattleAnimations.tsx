import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { useInvalidateQueries } from "../../../utils/hooks/queryHooks";

export default function BattleAnimations({
  enemyAnchors,
  partyPortraitAnchors,
  gameScreenRef,
}: {
  enemyAnchors: React.RefObject<{
    anchors: React.RefObject<HTMLButtonElement>[];
  } | null>;
  partyPortraitAnchors: React.RefObject<{
    anchors: React.RefObject<HTMLDivElement>[];
  } | null>;
  gameScreenRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { invalidatePartyInfo } = useInvalidateQueries();
  const setAllEventsToPlayed = useAppStore(
    (s) => s.battle.setAllEventsToPlayed
  );
  const enemies = useAppStore((s) => s.battle.enemies);
  const setPending = useAppStore((s) => s.battle.setPending);
  const events = useAppStore((s) => s.battle.events);
  const currentTurnCharacterId = useAppStore(
    (s) => s.battle.currentTurnCharacterId
  );
  const currentActionTarget = useAppStore((s) => s.battle.currentActionTarget);
  const partyCharacters = useAppStore((s) => s.party.data?.characters);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const gameScreenPosition = gameScreenRef.current?.getBoundingClientRect() || {
    top: 0,
    left: 0,
  };

  useEffect(() => {
    if (events.length > 0) {
      const firstUnplayedIndex = events.findIndex(
        (event) => event.played === false
      );
      if (firstUnplayedIndex !== -1) {
        setCurrentEventIndex(firstUnplayedIndex); // start from the first unplayed event
      } else {
        setCurrentEventIndex(events.length);
      }
    }
  }, [events]);

  const handleAnimationEnd = () => {
    setCurrentEventIndex((prev) => {
      if (prev + 1 >= events.length) {
        invalidatePartyInfo();
        setAllEventsToPlayed();
        setPending(false);
      }
      return prev + 1;
    });
  };

  const renderAnimation = () => {
    const currentEvent = events[currentEventIndex];
    let position: { left: number; top: number } | undefined = undefined;

    if (currentEvent.target_entities?.length > 0) {
      const targetId = currentEvent.target_entities[0].id;

      // Check if target is an enemy
      if (enemyAnchors.current) {
        enemies.forEach((enemy, index) => {
          if (enemy.id === targetId) {
            const enemyRef = enemyAnchors.current?.anchors[index];
            if (enemyRef && enemyRef.current) {
              const rect = enemyRef.current.getBoundingClientRect();
              position = {
                left: rect.left - gameScreenPosition.left + rect.width / 2,
                top: rect.top - gameScreenPosition.top + rect.height / 2,
              };
            }
          }
        });
      }

      // If not found among enemies, check party members
      if (!position && partyPortraitAnchors.current) {
        // console.log("Checking party characters for target:", targetId);
        // console.log("Party characters:", partyCharacters);
        // console.log("Party anchors:", partyPortraitAnchors.current.anchors);
        partyCharacters?.forEach((character, index) => {
          if (character.id === targetId) {
            const partyRef = partyPortraitAnchors.current?.anchors[index];
            console.log("Party ref:", partyRef);
            console.log("Party ref current:", partyRef?.current);
            if (partyRef && partyRef.current) {
              const rect = partyRef.current.getBoundingClientRect();
              position = {
                left: rect.left - gameScreenPosition.left + rect.width / 4,
                top: rect.top - gameScreenPosition.top + rect.height / 4,
              };
            }
          }
        });
      }
    }

    console.log("Animation position:", position);
    console.log("Game screen position:", gameScreenPosition);

    return (
      <div
        key={currentEventIndex} // force re-render new animation
        className="battle-animations animate-battle-event w-10 h-10 flex items-center justify-center absolute"
        onAnimationEnd={handleAnimationEnd}
        style={
          position ? position : { inset: "0", width: "100%", height: "100%" }
        }
      >
        {currentEvent.action === "weapon_attack" ||
        currentEvent.action === "use_skill" ? (
          <>
            <div className="slashable"></div>
            <div className="action-value absolute inset-0 w-full h-full font-bold text-3xl">
              {currentEvent.value}
            </div>
          </>
        ) : currentEvent.action === "use_magic" ? (
          <>
            <div className="sparks">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="action-value absolute inset-0 w-full h-full font-bold text-3xl text-shadow-black ">
              {currentEvent.value}
            </div>
          </>
        ) : (
          <span className="anchor font-bold text-3xl capitalize">
            {events[currentEventIndex].description}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {currentEventIndex >= 0 &&
        currentEventIndex < events.length &&
        events[currentEventIndex] &&
        renderAnimation()}
    </>
  );
}
