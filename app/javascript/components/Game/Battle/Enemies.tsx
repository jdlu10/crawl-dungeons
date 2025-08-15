import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";

export default function Enemies() {
  const enemies = useAppStore((s) => s.battle.enemies);

  return (
    <div className="enemies w-full h-full p-2.5 flex gap-8 items-center justify-center">
      {enemies &&
        enemies.map((enemy) => <div className="enemy">{enemy.name}</div>)}
    </div>
  );
}
