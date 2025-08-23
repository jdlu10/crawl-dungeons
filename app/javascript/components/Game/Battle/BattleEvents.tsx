import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../store/AppStore";

export default function BattleEvents() {
  const eventsRef = useRef<HTMLDivElement>(null);
  const events = useAppStore((s) => s.battle.events);
  const setPending = useAppStore((s) => s.battle.setPending);
  const prevLengthRef = useRef(events.length);

  useEffect(() => {
    if (events.length === prevLengthRef.current) {
      // events length didn't change, do nothing
      return;
    }

    setPending(true); // pending to play out event animactions

    // scroll into view
    if (eventsRef.current) {
      eventsRef.current.scrollTo({
        top: eventsRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    // update previous events length
    prevLengthRef.current = events.length;
  }, [events]);

  return (
    <div
      className="event-list w-full h-3/4 p-2.5 bg-black/50 border-2 border-white overflow-y-auto"
      ref={eventsRef}
    >
      {events.map((event, index) => (
        <div key={index}>{event.description}</div>
      ))}
    </div>
  );
}
