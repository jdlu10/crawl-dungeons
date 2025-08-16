import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";

export default function BattleEvents() {
  const events = useAppStore((s) => s.battle.events);

  return (
    <div className="event-list w-full h-3/4 p-2.5 bg-black/50 border-2 border-white overflow-y-auto"></div>
  );
}
