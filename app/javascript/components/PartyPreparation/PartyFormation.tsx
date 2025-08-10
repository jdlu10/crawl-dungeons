import React, { useEffect } from "react";
import { useAppStore } from "../../store/AppStore";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../Utils/Button";
import Loading from "../Utils/Loading";
import {
  useAddCharacterToParty,
  useQueryGetAvailableCharacters,
  useRemoveCharacterFromParty,
} from "../../utils/hooks/characterHooks";
import { useCurrentPartyFrame } from "../Game/Party/CurrentPartyFrame";
import { useResumeAdventure } from "../../utils/hooks/gameHooks";
import ElementIcons from "../Utils/ElementIcons";
import { ElementName, VocationName } from "../../types/GameTypes";
import VocationIcons from "../Utils/VocationIcons";

type PartyFormationProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function PartyFormation(props: PartyFormationProps) {
  const playerId = useAppStore((state) => state.playerId);
  const game = useAppStore((state) => state.game);
  const partyData = useAppStore((state) => state.party.data);
  const queryClient = useQueryClient();

  const {
    data: available_characters,
    isLoading: isLoadingAvailableCharacters,
    isError: isErrorAvailableCharacters,
  } = useQueryGetAvailableCharacters({ gameId: game.id, playerId: playerId });

  const { mutateAsync: addCharacterToParty } = useAddCharacterToParty({
    onSuccess: (data, addedCharacterId) => {
      queryClient.invalidateQueries({ queryKey: ["party", game.id, playerId] });
      queryClient.invalidateQueries({
        queryKey: ["available_characters", game.id, playerId],
      });
    },
    onError: (error) => {
      console.error("Error adding character:", error);
      alert(
        "Failed add character to party. Please try again. Max player characters in a party is 4."
      );
    },
  });

  const { mutateAsync: removeCharacterFromParty } = useRemoveCharacterFromParty(
    {
      onSuccess: (data, removedCharacterId) => {
        queryClient.invalidateQueries({
          queryKey: ["party", game.id, playerId],
        });
        queryClient.invalidateQueries({
          queryKey: ["available_characters", game.id, playerId],
        });
      },
      onError: (error) => {
        console.error("Error removing character:", error);
        alert("Failed remove character to party. Please try again.");
      },
    }
  );

  const { getIdPartyPosition, setArrangePartyEnabled, CurrentPartyFrame } =
    useCurrentPartyFrame({
      onClick: (character) => {
        removeCharacterFromParty({
          game_id: game.id,
          player_id: playerId,
          character_id: character.id,
        });
      },
    });

  const { mutateAsync: resumeGame } = useResumeAdventure({
    onSuccess: () => {
      game.setGameState("game");
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["available_characters", game.id, playerId],
    });
    queryClient.invalidateQueries({ queryKey: ["party", game.id, playerId] });
    setArrangePartyEnabled(true);
  }, []);

  return (
    <div className="h-full grid grid-cols-5 grid-rows-[auto_auto_1fr_auto] gap-4">
      <div className="col-span-5">
        <h1 className="mb-1 text-4xl font-semibold tracking-tight">
          Form your party
        </h1>
      </div>
      <div className="col-span-3 row-start-2 flex gap-4 items-center">
        <h2 className="font-bold">
          Create your character or select from below
        </h2>
        <Button
          onClick={() => props.setCurrentMenu("character-creation")}
          classNames="!mb-0"
        >
          Create Character
        </Button>
      </div>
      <div className="col-span-2 row-start-2 flex items-center">
        <h2 className="font-bold">Current party (Choose up to 4 max)</h2>
      </div>
      <div className="col-span-3 row-start-3 overflow-y-auto flex flex-col">
        {isLoadingAvailableCharacters && <Loading />}
        {available_characters?.map((available_character) => (
          <button
            key={`game-${available_character.id}`}
            className={`cursor-pointer flex hover:bg-gray-700`}
            onClick={() => {
              const newPosition = getIdPartyPosition(0);
              addCharacterToParty({
                game_id: game.id,
                player_id: playerId,
                character_id: available_character.id,
                target_position_row: newPosition.row,
                target_position_column: newPosition.col,
              });
            }}
          >
            <img
              src={available_character.visual_render.url}
              className="w-10 h-10"
              title={`${available_character.name} - ${available_character.description}`}
            />
            <div
              className={`w-10 h-10 icon-vocation-${available_character.vocation.name}`}
              title={`${available_character.vocation.name} - ${available_character.vocation.description}`}
            >
              <VocationIcons
                name={available_character.vocation.icon.name as VocationName}
              />
            </div>
            <div
              className={`w-10 h-10 icon-element-${available_character.element.key}`}
              title={available_character.element.description}
            >
              <ElementIcons
                name={
                  available_character.element.visual_render.name as ElementName
                }
              />
            </div>
            <div className="font-bold text-2xl px-5">
              {available_character.name}
            </div>
          </button>
        ))}
      </div>
      <div className="col-span-2 row-start-3">
        <CurrentPartyFrame />
      </div>
      <div className="col-span-3 row-start-4 pt-5">
        <Button onClick={() => game.setGameState("main-menu")}>
          Back to Main Menu
        </Button>
      </div>
      <div className="col-span-2 row-start-4 pt-5 justify-self-center">
        <Button
          onClick={() => {
            resumeGame({ game_id: game.id, player_id: playerId });
          }}
          disabled={partyData?.characters && partyData?.characters.length === 0}
          classNames="!bg-blue-800/[var(--bg-opacity)]"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
}
