import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";

export default function BattleCommands() {
  const currentTurnCharacterId = useAppStore(
    (s) => s.battle.currentTurnCharacterId
  );

  return (
    <div className="commands w-full h-full p-2.5 bg-black/50 border-2 border-white"></div>
  );
}
