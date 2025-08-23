import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { Character } from "../../../types/CharacterTypes";

export default function TurnOrder() {
  const partyCharacters = useAppStore<Character[] | undefined>(
    (s) => s.party.data?.characters
  );
  const enemies = useAppStore((s) => s.battle.enemies);
  const turnOrder = useAppStore((s) => s.battle.turnOrder);
  const currentTurnCharacterId = useAppStore(
    (s) => s.battle.currentTurnCharacterId
  );

  const reorder = React.useCallback(function reorder({
    currentTurnCharacterId,
    turnOrder = [],
  }: {
    currentTurnCharacterId: number;
    turnOrder: number[];
  }) {
    const currentTurnCharacterIndex = turnOrder.indexOf(currentTurnCharacterId);
    if (currentTurnCharacterIndex === 0) {
      return turnOrder;
    } else {
      const charactersToMove = turnOrder.slice(0, currentTurnCharacterIndex);
      const frontOfList = turnOrder.slice(currentTurnCharacterIndex);
      return [...frontOfList, ...charactersToMove];
    }
  },
  []);

  let currentTurnOrder: number[] = reorder({
    currentTurnCharacterId,
    turnOrder,
  });

  const TurnOrderFrame = React.memo(function TurnOrderFrame({
    characterId,
    partyCharacters = [],
    enemies,
  }: {
    characterId: number;
    partyCharacters: Character[] | undefined;
    enemies: Character[];
  }) {
    const allCombatActors = [...partyCharacters, ...enemies];
    const character = allCombatActors?.find(
      (actor) => actor.id === characterId
    );
    return (
      <img
        title={character?.name}
        src={character?.visual_render.url}
        className={`w-full h-full ${
          character?.hit_points !== undefined && character.hit_points <= 0
            ? "incapacitated"
            : ""
        }`}
      />
    );
  });

  useEffect(() => {
    currentTurnOrder = reorder({ currentTurnCharacterId, turnOrder });
  }, [currentTurnCharacterId]);

  return (
    <div className="order-list w-4/6 h-full">
      {Array.isArray(currentTurnOrder) && currentTurnOrder.length > 0 && (
        <ul>
          {currentTurnOrder.map((characterId) => (
            <li key={characterId}>
              <TurnOrderFrame
                characterId={characterId}
                partyCharacters={partyCharacters}
                enemies={enemies}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
