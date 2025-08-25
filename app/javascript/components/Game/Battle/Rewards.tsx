import React, { useCallback, useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";

export default function Rewards() {
  const experienceGain = useAppStore((s) => s.battle.experienceGain);
  const droppedWealth = useAppStore((s) => s.battle.droppedWealth);
  const droppedItems = useAppStore((s) => s.battle.rewards);
  const setCurrentActionTarget = useAppStore(
    (s) => s.battle.setCurrentActionTarget
  );

  return (
    <div
      className={`enemies w-full h-full p-2.5 flex flex-col gap-8 items-center justify-center`}
    >
      <p className="text-2xl">
        The party has gained {experienceGain} experience points and found{" "}
        {droppedWealth} gold coins!
      </p>
      {droppedItems.length > 0 && (
        <p className="text-2xl">
          The following items were found on the monsters:{" "}
          {droppedItems.map((droppedItem) => droppedItem.item.name).join(", ")}
        </p>
      )}
      <button
        className={`enemy hover:bg-gray-600/50 border-gray-400 cursor-pointer disabled:cursor-default text-2xl`}
        onClick={(e) => {
          e.currentTarget.disabled = true;
        }}
      >
        Accept Rewards
      </button>
    </div>
  );
}
