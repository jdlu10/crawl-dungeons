import React, { useCallback, useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { useInvalidateQueries } from "../../../utils/hooks/queryHooks";
import { useQueryCombatRewardsActions } from "../../../utils/hooks/combatHooks";

export default function Rewards() {
  const gameId = useAppStore((s) => s.game.id);
  const playerId = useAppStore((s) => s.playerId);
  const experienceGain = useAppStore((s) => s.battle.experienceGain);
  const droppedWealth = useAppStore((s) => s.battle.droppedWealth);
  const droppedItems = useAppStore((s) => s.battle.rewards);
  const resetBattle = useAppStore((s) => s.battle.resetBattle);
  const { invalidatePartyInfo } = useInvalidateQueries();
  const { mutateAsync: acceptRewardsAction, isPending } =
    useQueryCombatRewardsActions({
      onSuccess: (events) => {
        resetBattle();
        invalidatePartyInfo();
      },
      onError: (error) => {
        console.error("Error with the item action:", error);
      },
    });

  return (
    <div
      className={`enemies w-full h-full p-2.5 flex flex-col gap-8 items-center justify-end`}
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
        className={`enemy hover:bg-gray-600/50 border-gray-400 cursor-pointer disabled:cursor-default text-2xl uppercase border-2 rounded p-3 bg-gray-800/50`}
        onClick={(e) => {
          e.currentTarget.disabled = true;
          acceptRewardsAction({ game_id: gameId, player_id: playerId });
        }}
      >
        Accept Rewards
      </button>
    </div>
  );
}
