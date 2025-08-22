import React, { useCallback, useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { Character } from "../../../types/CharacterTypes";

export default function Enemies() {
  const enemies = useAppStore((s) => s.battle.enemies);
  const targetMode = useAppStore((state) => state.battle.targetMode);
  const setCurrentActionTarget = useAppStore(
    (s) => s.battle.setCurrentActionTarget
  );

  const handleEnemyClick = useCallback((target: Character) => {
    setCurrentActionTarget(target);
  }, []);

  return (
    <div
      className={`enemies w-full h-full p-2.5 flex gap-8 items-center justify-center`}
    >
      {enemies &&
        enemies.map((enemy) => (
          <button
            className={`enemy hover:bg-gray-600/50 border-gray-400 cursor-pointer disabled:cursor-default ${
              targetMode && "relative z-20"
            }`}
            disabled={enemy.hit_points <= 0}
            onClick={() => {
              if (targetMode) {
                handleEnemyClick(enemy);
              }
            }}
          >
            {enemy.name}
          </button>
        ))}
    </div>
  );
}
