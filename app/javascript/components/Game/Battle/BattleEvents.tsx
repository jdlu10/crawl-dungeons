import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";

export default function BattleEvents() {
  const events = useAppStore((s) => s.battle.events);

  return <div className="event-list w-full h-full p-2.5"></div>;
}
