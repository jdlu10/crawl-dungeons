import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { useInvalidateQueries } from "../../../utils/hooks/queryHooks";

export default function BattleAnimations() {
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

  return (
    <>
      {currentEventIndex >= 0 &&
        currentEventIndex < events.length &&
        events[currentEventIndex] && (
          <div
            key={currentEventIndex} // force re-render new animation
            className="battle-animations animate-battle-event bg-amber-800 w-full h-full flex items-center justify-center absolute inset-0"
            onAnimationEnd={handleAnimationEnd}
          ></div>
        )}
    </>
  );
}
