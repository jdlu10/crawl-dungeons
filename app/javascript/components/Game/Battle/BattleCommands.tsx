import React, { useCallback, useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import {
  Ability,
  Character,
  Inventory,
  VocationAbility,
} from "../../../types/CharacterTypes";
import { useQueryAbilityActions } from "../../../utils/hooks/combatHooks";
import { useInvalidateQueries } from "../../../utils/hooks/queryHooks";

export default function BattleCommands() {
  const { invalidateCombatInfo, invalidatePartyInfo } = useInvalidateQueries();
  const [menuState, setMenuState] = useState("simple");
  const [basicCommands, setBasicCommands] = useState<VocationAbility[]>([]);

  const gameId = useAppStore((s) => s.game.id);
  const playerId = useAppStore((s) => s.playerId);
  const setTargetMode = useAppStore((s) => s.battle.setTargetMode);
  const setPending = useAppStore((s) => s.battle.setPending);
  const setCurrentAction = useAppStore((s) => s.battle.setCurrentAction);
  const currentAction = useAppStore((s) => s.battle.currentAction);
  const currentActionTarget = useAppStore((s) => s.battle.currentActionTarget);
  const currentTurnCharacterId = useAppStore(
    (s) => s.battle.currentTurnCharacterId
  );
  const battle = useAppStore((s) => s.battle);
  const resetCurrentAction = useAppStore(
    (state) => state.battle.resetCurrentAction
  );
  const partyData = useAppStore((state) => state.party.data);

  const currentTurnCharacter = partyData?.characters.find(
    (character) => character.id === currentTurnCharacterId
  );

  const filtered_inventories =
    currentTurnCharacter?.filtered_inventories.filter(
      (inventory_item) => inventory_item.item.usable
    );

  const usableAbility = useCallback(
    (currentTurnCharacter: Character | undefined, ability: Ability) => {
      const currentPowerPoints = currentTurnCharacter?.power_points || 0;
      return ability.cost > 0 && currentPowerPoints < ability.cost;
    },
    []
  );

  const noHiddenStatusRequired = useCallback(
    (character: Character | undefined, ability: Ability) => {
      if (!["sneak_attack", "steal"].includes(ability.key)) {
        return false;
      }

      return !character?.character_statuses.some(
        (cs) => cs.status.key === "hidden"
      );
    },
    []
  );

  const skipTargetMode = useCallback(() => {
    return (
      currentAction?.type === "ability" &&
      (currentAction.command.key === "flee" ||
        currentAction.command.key === "defend")
    );
  }, [currentAction]);

  const handleSkillCommand = useCallback(
    (currentTurnCharacter: Character | undefined, command: Ability) => {
      if (["skills", "magic", "use_item"].indexOf(command.key) >= 0) {
        // handle basic actions that brings up submenus
        setMenuState(command.key);
      } else if (command.key === "back") {
        // handle going back to basic actions menu
        setMenuState("simple");
      } else {
        // send off ability command to backend
        setCurrentAction({ type: "ability", command });
      }
    },
    []
  );

  const handleItemCommand = useCallback(
    (currentTurnCharacter: Character | undefined, command: Inventory) => {
      setCurrentAction({ type: "inventory", command });
    },
    []
  );

  const {
    mutateAsync: battleAction,
    isPending,
    isSuccess,
  } = useQueryAbilityActions({
    onSuccess: (battleEvents, actionItemId, targetCharacterId) => {
      for (const event of battleEvents) {
        battle.pushBattleEvent(event);
      }
      invalidateCombatInfo();
      // invalidatePartyInfo();
      resetCurrentAction();
      setMenuState("simple");
    },
    onError: (error) => {
      console.error("Error with the item action:", error);
    },
  });

  useEffect(() => {
    if (!currentTurnCharacter) return;

    let commands = currentTurnCharacter.vocation.vocation_abilities.filter(
      (vocation_ability) => vocation_ability.ability.ability_type === menuState
    );

    if (menuState === "skills" || menuState === "magic") {
      commands = [
        ...commands,
        {
          ability: { key: "back", name: "Back" } as Ability,
        } as VocationAbility,
      ];
    } else if (menuState === "use_item") {
      commands = [
        ...commands,
        {
          ability: { key: "back", name: "Back" } as Ability,
        } as VocationAbility,
      ];
    }

    setBasicCommands(commands);
  }, [menuState, currentTurnCharacter]);

  useEffect(() => {
    if (currentAction && !skipTargetMode()) {
      setTargetMode(true);
    } else {
      setTargetMode(false);
    }
  }, [currentAction]);

  useEffect(() => {
    if (currentAction && skipTargetMode()) {
      setPending(true);
      battleAction({
        game_id: gameId,
        player_id: playerId,
        character_id: undefined,
        ability_id: currentAction?.command.id,
      });
    } else if (currentAction && currentActionTarget) {
      setPending(true);
      battleAction({
        game_id: gameId,
        player_id: playerId,
        character_id: currentActionTarget.id,
        ability_id: currentAction.command.id,
      });
    }
  }, [currentAction, currentActionTarget]);

  return (
    <>
      {currentTurnCharacter && (
        <div className="w-full bg-black/50 border-2 border-white py-2 font-bold px-2.5 mb-2.5">
          {currentTurnCharacter?.name}'s Turn
        </div>
      )}
      <div className="commands w-full h-3/4 bg-black/50 border-2 border-white overflow-y-auto flex flex-col items-start py-2">
        {menuState !== "use_item" &&
          basicCommands &&
          basicCommands.map((vocation_ability) => {
            return (
              <button
                key={vocation_ability.id}
                onClick={(e) => {
                  handleSkillCommand(
                    currentTurnCharacter,
                    vocation_ability.ability
                  );
                }}
                disabled={
                  usableAbility(
                    currentTurnCharacter,
                    vocation_ability.ability
                  ) ||
                  noHiddenStatusRequired(
                    currentTurnCharacter,
                    vocation_ability.ability
                  )
                }
                className="w-full text-left px-2.5 py-1 font-bold cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-gray-700"
              >
                {vocation_ability.ability.name}
              </button>
            );
          })}
        {menuState === "use_item" && (
          <>
            {filtered_inventories?.map((inventory) => (
              <button
                key={inventory.id}
                onClick={(e) => {
                  handleItemCommand(currentTurnCharacter, inventory);
                }}
                className="w-full text-left px-2.5 py-1 font-bold cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-gray-700"
              >
                {inventory.item.name}
              </button>
            ))}
            <button
              onClick={(e) => {
                setMenuState("simple");
              }}
              className="w-full text-left px-2.5 py-1 font-bold cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Back
            </button>
          </>
        )}
      </div>
    </>
  );
}
