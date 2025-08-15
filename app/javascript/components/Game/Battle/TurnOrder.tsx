import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { Character } from "../../../types/CharacterTypes";

export default function TurnOrder() {
  const partyCharacters = useAppStore<Character[] | undefined>(
    (s) => s.party.data?.characters
  );
  const enemies = useAppStore((s) => s.battle.enemies);
  const turnOrder = useAppStore((s) => s.battle.turnOrder);
  console.log(turnOrder);

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
    return <img src={character?.visual_render.url} className="w-full h-full" />;
  });

  return (
    <div className="order-list w-full h-full p-2.5">
      {Array.isArray(turnOrder) && turnOrder.length > 0 && (
        <ul>
          {turnOrder.map((characterId) => (
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
