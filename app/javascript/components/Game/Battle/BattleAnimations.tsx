import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { useInvalidateQueries } from "../../../utils/hooks/queryHooks";

export default function BattleAnimations({
  enemyAnchors,
  partyPortraitAnchors,
}: {
  enemyAnchors: React.RefObject<{
    anchors: React.RefObject<HTMLButtonElement>[];
  } | null>;
  partyPortraitAnchors: React.RefObject<{
    anchors: React.RefObject<HTMLDivElement>[];
  } | null>;
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
    console.log(events[currentEventIndex]);
    const currentEvent = events[currentEventIndex];
    let position: { x: number; y: number } | undefined = undefined;

    if (currentEvent.target_entities?.length > 0) {
      const targetId = currentEvent.target_entities[0].id;

      // Check if target is an enemy
      if (enemyAnchors.current) {
        enemies.forEach((enemy, index) => {
          if (enemy.id === targetId) {
            console.log(enemy.id);
            console.log(targetId);
            const enemyRef = enemyAnchors.current?.anchors[index];
            if (enemyRef && enemyRef.current) {
              const rect = enemyRef.current.getBoundingClientRect();
              position = { x: rect.left + rect.width / 2, y: rect.top };
            }
          }
        });
      }

      // If not found among enemies, check party members
      if (!position && partyPortraitAnchors.current) {
        partyCharacters?.forEach((character, index) => {
          if (character.id === targetId) {
            const partyRef = partyPortraitAnchors.current?.anchors[index];
            if (partyRef && partyRef.current) {
              const rect = partyRef.current.getBoundingClientRect();
              position = { x: rect.left + rect.width / 2, y: rect.top };
            }
          }
        });
      }
    }

    return (
      <div
        key={currentEventIndex} // force re-render new animation
        className="battle-animations animate-battle-event w-full h-full flex items-center justify-center absolute"
        onAnimationEnd={handleAnimationEnd}
        style={
          position
            ? {}
            : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
        }
      >
        <span className="anchor font-bold text-3xl capitalize">
          {/* Battle Effect {enemyAnchors.current?.anchors.length} -{" "}
          {partyPortraitAnchors.current?.anchors.length} */}
          {events[currentEventIndex].description}
        </span>
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
