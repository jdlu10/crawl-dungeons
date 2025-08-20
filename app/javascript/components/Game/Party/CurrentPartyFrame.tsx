import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import {
  Character,
  PartyPosition,
  PartyPositions,
} from "../../../types/CharacterTypes";
import { CaretUp, CaretDown, CaretLeft, CaretRight } from "../../Utils/Carets";
import { usePartyMemberSwapPosition } from "../../../utils/hooks/characterHooks";
import { useQueryClient } from "@tanstack/react-query";
import ElementIcons from "../../Utils/ElementIcons";
import { ElementName, VocationName } from "../../../types/GameTypes";
import VocationIcons from "../../Utils/VocationIcons";
import { useInvalidateQueries } from "../../../utils/hooks/queryHooks";

type TCurrentPartyFrameOptions = {
  onClick?: (character: Character) => void;
  innerFrameStyle?: string;
  additionalElements?: (character: Character) => React.ReactNode;
};

export function useCurrentPartyFrame(options?: TCurrentPartyFrameOptions) {
  const { invalidatePartyInfo } = useInvalidateQueries();
  const playerId = useAppStore((state) => state.playerId);
  const game = useAppStore((state) => state.game);
  const partyData = useAppStore((state) => state.party.data);
  const targetMode = useAppStore((state) => state.battle.targetMode);
  const currentTurnCharacterId = useAppStore(
    (state) => state.battle.currentTurnCharacterId
  );
  const queryClient = useQueryClient();
  const innerFrameStyle = options?.innerFrameStyle || "w-32 h-32";

  const defaultPartyPositions: PartyPositions = [
    [0, 0, 0],
    [0, 0, 0],
  ];
  const [partyPositions, setPartyPositions] = useState<PartyPositions>(
    defaultPartyPositions
  );
  const [arrangePartyEnabled, setArrangePartyEnabled] = useState(false);

  const { mutateAsync: partyMemberSwapPosition } = usePartyMemberSwapPosition({
    onSuccess: (data, swappedCharacterId) => {
      invalidatePartyInfo();
    },
    onError: (error) => {
      console.error("Error switching character:", error);
      alert("Failed switching character to party. Please try again.");
    },
  });

  useEffect(() => {
    if (partyData) {
      // reset party positions
      setPartyPositions(defaultPartyPositions);

      const { characters } = partyData;
      characters?.forEach((character) => {
        setPartyPositions((previous) => {
          return getUpdatedPartyPositions(
            previous,
            {
              row: character.party_position_row,
              col: character.party_position_column,
            },
            character.id
          );
        });
      });
    }
  }, [partyData]);

  const getUpdatedPartyPositions = (
    from: PartyPositions,
    targetPartyPosition: PartyPosition,
    id: number
  ): PartyPositions => {
    const newPartyPositions: PartyPositions = [[...from[0]], [...from[1]]];
    newPartyPositions[targetPartyPosition.row][targetPartyPosition.col] = id;
    return newPartyPositions;
  };

  const getIdPartyPosition = (id: number): PartyPosition => {
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        if (partyPositions[row][col] === id) {
          return { row, col };
        }
      }
    }
    return { row: -1, col: -1 };
  };

  const updateCurrentPartyPosition = (findId: number, newId: number) => {
    let targetPartyPosition: PartyPosition = getIdPartyPosition(findId);
    if (targetPartyPosition.row >= 0 && targetPartyPosition.col >= 0) {
      setPartyPositions((previous) => {
        return getUpdatedPartyPositions(previous, targetPartyPosition, newId);
      });
    }
  };

  const getCharacterByIdFromParty = (characterId: number): Character => {
    let foundCharacter = {} as Character;
    partyData?.characters.forEach((character) => {
      if (character.id === characterId) {
        foundCharacter = character;
      }
    });
    return foundCharacter;
  };

  const moveUpEnabled = (character: Character): boolean => {
    return character.party_position_row === 1;
  };
  const moveDownEnabled = (character: Character): boolean => {
    return character.party_position_row === 0;
  };
  const moveLeftEnabled = (character: Character): boolean => {
    return character.party_position_column > 0;
  };
  const moveRightEnabled = (character: Character): boolean => {
    return character.party_position_column < 2;
  };

  const EmptyPartyCharacterFrame = () => {
    return (
      <div className={`empty-character-frame  relative flex`}>
        <div
          className={`border-2 border-gray-400 ${innerFrameStyle} relative`}
        ></div>
        {options?.additionalElements && (
          <div className="party-frame-sub-elements flex">
            {options.additionalElements({} as Character)}
          </div>
        )}
      </div>
    );
  };

  const PartyCharacterFrame = ({ character }: { character: Character }) => (
    <div className="party-frame-container relative flex">
      <button
        key={`game-${character.id}`}
        className={`bg-element-${character.element.key} cursor-pointer border-gray-400 border-2 ${innerFrameStyle} relative overflow-hidden`}
        onClick={
          options?.onClick ? (e) => options.onClick?.(character) : undefined
        }
      >
        <img
          src={character.visual_render.url}
          className=""
          title={`${character.name} - ${character.description}`}
        />
        <div className="font-bold text-lg absolute bottom-0 left-0 right-0 bg-opacity-75 bg-gray-900">
          {character.name}
        </div>
        <div
          className={`w-5 h-5 absolute top-0 icon-element-${character.element.key}`}
          title={character.element.description}
        >
          <ElementIcons
            name={character.element.visual_render.name as ElementName}
          />
        </div>
        <div
          className={`w-5 h-5 absolute top-0 right-0 icon-vocation-${character.vocation.name}`}
          title={`${character.vocation.name}`}
        >
          <VocationIcons name={character.vocation.icon.name as VocationName} />
        </div>
      </button>
      {options?.additionalElements && (
        <div className="party-frame-sub-elements flex">
          {options.additionalElements(character)}
        </div>
      )}

      {arrangePartyEnabled && (
        <div className="party-character-frame-controls">
          {moveUpEnabled(character) && (
            <button
              key={`move-up-${character.id}`}
              className={`cursor-pointer absolute -top-2 left-6 right-6 h-5 justify-items-center`}
              onClick={() => {
                partyMemberSwapPosition({
                  game_id: game.id,
                  player_id: playerId,
                  character_id: character.id,
                  target_position_row: character.party_position_row - 1,
                  target_position_column: character.party_position_column,
                });
              }}
            >
              <CaretUp />
            </button>
          )}
          {moveDownEnabled(character) && (
            <button
              key={`move-down-${character.id}`}
              className={`cursor-pointer absolute -bottom-2 left-6 right-6 h-5 justify-items-center`}
              onClick={() => {
                partyMemberSwapPosition({
                  game_id: game.id,
                  player_id: playerId,
                  character_id: character.id,
                  target_position_row: character.party_position_row + 1,
                  target_position_column: character.party_position_column,
                });
              }}
            >
              <CaretDown />
            </button>
          )}
          {moveLeftEnabled(character) && (
            <button
              key={`move-left-${character.id}`}
              className={`cursor-pointer absolute top-5 -left-3 bottom-5 w-6`}
              onClick={() => {
                partyMemberSwapPosition({
                  game_id: game.id,
                  player_id: playerId,
                  character_id: character.id,
                  target_position_row: character.party_position_row,
                  target_position_column: character.party_position_column - 1,
                });
              }}
            >
              <CaretLeft />
            </button>
          )}
          {moveRightEnabled(character) && (
            <button
              key={`move-right-${character.id}`}
              className={`cursor-pointer absolute top-5 -right-3 bottom-5 w-6`}
              onClick={() => {
                partyMemberSwapPosition({
                  game_id: game.id,
                  player_id: playerId,
                  character_id: character.id,
                  target_position_row: character.party_position_row,
                  target_position_column: character.party_position_column + 1,
                });
              }}
            >
              <CaretRight />
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderPartyFrame = (characterId: number) => {
    if (characterId === 0) return <EmptyPartyCharacterFrame />;
    const character = getCharacterByIdFromParty(characterId);
    return character.id ? <PartyCharacterFrame character={character} /> : <></>;
  };

  const CurrentPartyFrame = () => (
    <section
      className={`party-frame ${
        partyData?.status === "combat" ? "in-combat" : ""
      } grid grid-rows-[1fr_1fr] gap-y-4 ${targetMode && "relative z-20"}`}
    >
      {partyPositions.map((partyPositionsRow, rowIndex) => (
        <div
          key={`party-frame-row-${rowIndex}`}
          className={`party-frame-row grid grid-cols-3 ${
            partyData?.status === "combat" ? "gap-x-5" : "gap-x-2"
          }`}
        >
          {partyPositionsRow.map((idAtPosition, colIndex) => (
            <div
              key={`party-frame-col-${colIndex}`}
              className={`frame-inner justify-items-center relative  ${
                currentTurnCharacterId !== 0 &&
                currentTurnCharacterId === idAtPosition
                  ? "acting-character"
                  : ""
              }`}
            >
              {renderPartyFrame(idAtPosition)}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
  return {
    partyPositions,
    setPartyPositions,
    setArrangePartyEnabled,
    updateCurrentPartyPosition,
    getIdPartyPosition,
    getUpdatedPartyPositions,
    CurrentPartyFrame,
  };
}
