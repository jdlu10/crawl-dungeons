import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { Character } from "../../../types/CharacterTypes";

const Enemies = React.forwardRef(
  (
    props,
    ref: React.Ref<{ anchors: React.RefObject<HTMLButtonElement | null>[] }>
  ) => {
    const enemies = useAppStore((s) => s.battle.enemies);
    const targetMode = useAppStore((state) => state.battle.targetMode);
    const setCurrentActionTarget = useAppStore(
      (s) => s.battle.setCurrentActionTarget
    );

    const handleEnemyClick = useCallback((target: Character) => {
      setCurrentActionTarget(target);
    }, []);

    const refs = [...Array(enemies.length)].map(() =>
      React.createRef<HTMLButtonElement>()
    );

    React.useImperativeHandle(ref, () => ({
      anchors: refs,
    }));

    return (
      <div
        className={`enemies w-full h-full p-2.5 flex gap-8 items-center justify-center`}
      >
        {enemies &&
          enemies
            .sort((a, b) => a.party_position_column - b.party_position_column)
            .map((enemy, index) => (
              <button
                ref={refs[index]}
                key={enemy.id}
                id={`character-icon-${enemy.id}`}
                className={`enemy hover:bg-gray-600/50 border-gray-400 cursor-pointer disabled:cursor-default overflow-hidden max-w-[20%] ${
                  targetMode && "relative z-20"
                }`}
                disabled={enemy.hit_points <= 0}
                onClick={() => {
                  if (targetMode) {
                    handleEnemyClick(enemy);
                  }
                }}
              >
                <img
                  title={enemy.name}
                  src={enemy.visual_render.url}
                  className={`w-full h-full ${
                    enemy.hit_points !== undefined && enemy.hit_points <= 0
                      ? "incapacitated"
                      : ""
                  }`}
                />
              </button>
            ))}
      </div>
    );
  }
);

export default Enemies;

Enemies.displayName = "Enemies";
