import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Character,
  CharacterForm,
  CharacterTemplateWithSkills,
} from "../../types/CharacterTypes";
import { Party, useQueryGetGameInfoParams } from "../../types/GameTypes";

export function useQueryGetCurrentParty(params: useQueryGetGameInfoParams) {
  const { gameId, playerId } = params;
  const playerGamesQuery = useQuery({
    queryKey: ["party", gameId, playerId],
    queryFn: async () => {
      if (!playerId || !gameId) return {} as Party;
      const response = await fetch(
        "/api/v1/games/" + gameId + "/party?player_id=" + playerId
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Party;
    },
  });
  return playerGamesQuery;
}

export function useQueryGetAvailableCharacters(
  params: useQueryGetGameInfoParams
) {
  const { gameId, playerId } = params;
  const playerGamesQuery = useQuery({
    queryKey: ["available_characters", gameId, playerId],
    queryFn: async () => {
      if (!playerId || !gameId) return [] as Character[];
      const response = await fetch(
        "/api/v1/games/" +
          gameId +
          "/available_characters?player_id=" +
          playerId
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Character[];
    },
  });
  return playerGamesQuery;
}

type usePartyManageQueriesParams = {
  onSuccess?: (data: Party, targetCharacterId: number) => void;
  onError?: (error: any) => void;
};

export function useAddCharacterToParty(params: usePartyManageQueriesParams) {
  const addCharacterToParty = useMutation({
    mutationFn: async (addToPartyParams: {
      game_id: number | undefined;
      player_id: number | undefined;
      character_id: number;
      target_position_row: number;
      target_position_column: number;
    }) => {
      const response = await fetch(
        "/api/v1/games/" + addToPartyParams.game_id + "/party/characters/add",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addToPartyParams),
        }
      );
      if (!response.ok) {
        throw new Error("Fail to add character to player party.");
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      if (params?.onSuccess) {
        params?.onSuccess(data, variables.character_id);
      }
    },
    onError: params?.onError,
  });
  return addCharacterToParty;
}

export function useRemoveCharacterFromParty(
  params: usePartyManageQueriesParams
) {
  const removeCharacterFromParty = useMutation({
    mutationFn: async (addToPartyParams: {
      game_id: number | undefined;
      player_id: number | undefined;
      character_id: number;
    }) => {
      const response = await fetch(
        "/api/v1/games/" +
          addToPartyParams.game_id +
          "/party/characters/remove",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addToPartyParams),
        }
      );
      if (!response.ok) {
        throw new Error("Fail to remove character to player party.");
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      if (params?.onSuccess) {
        params?.onSuccess(data, variables.character_id);
      }
    },
    onError: params?.onError,
  });
  return removeCharacterFromParty;
}

export function usePartyMemberSwapPosition(
  params: usePartyManageQueriesParams
) {
  const partyMemberSwapPosition = useMutation({
    mutationFn: async (addToPartyParams: {
      game_id: number | undefined;
      player_id: number | undefined;
      character_id: number;
      target_position_row: number;
      target_position_column: number;
    }) => {
      const response = await fetch(
        "/api/v1/games/" + addToPartyParams.game_id + "/party/characters/swap",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addToPartyParams),
        }
      );
      if (!response.ok) {
        throw new Error("Fail to remove character to player party.");
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      if (params?.onSuccess) {
        params?.onSuccess(data, variables.character_id);
      }
    },
    onError: params?.onError,
  });
  return partyMemberSwapPosition;
}

export function useQueryCharacterTemplate(vocationId: number | undefined) {
  const vocationTemplateQuery = useQuery({
    queryKey: ["vocation_template", vocationId],
    queryFn: async () => {
      if (!vocationId) return {} as CharacterTemplateWithSkills;
      const response = await fetch(
        "/api/v1/character_template?vocation_id=" + vocationId
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as CharacterTemplateWithSkills;
    },
    enabled: !!vocationId,
  });
  return vocationTemplateQuery;
}

export function useQueryCreateCharacter(params: {
  onSuccess?: (data: Character) => void;
  onError?: (error: any) => void;
}) {
  const createCharacterQuery = useMutation({
    mutationFn: async (createCharacterParams: CharacterForm) => {
      const response = await fetch("/api/v1/create_new_character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createCharacterParams),
      });
      if (!response.ok) {
        throw new Error("Fail to add character to player party.");
      }
      return await response.json();
    },
    onSuccess: params?.onSuccess,
    onError: params?.onError,
  });
  return createCharacterQuery;
}

type ItemActions = "move" | "use" | "equip" | "discard";

type useCharacterInteractionQueriesParams = {
  onSuccess?: (
    data: Party,
    action: ItemActions,
    targetCharacterId: number | undefined
  ) => void;
  onError?: (error: any) => void;
};

export function useQueryInventoryActions(
  params: useCharacterInteractionQueriesParams
) {
  const createCharacterQuery = useMutation({
    mutationFn: async (inventoryActionParams: {
      game_id: number | undefined;
      player_id: number | undefined;
      character_id: number | undefined;
      inventory_id: number;
      action: ItemActions;
    }) => {
      const response = await fetch(
        "/api/v1/games/" +
          inventoryActionParams.game_id +
          "/party/inventory/" +
          inventoryActionParams.inventory_id +
          "/" +
          inventoryActionParams.action,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inventoryActionParams),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to ${inventoryActionParams.action} item: ${
            inventoryActionParams.inventory_id
          } ${
            inventoryActionParams.character_id
              ? "for character " + inventoryActionParams.character_id
              : ""
          }`
        );
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      if (params?.onSuccess) {
        params?.onSuccess(data, variables.action, variables.character_id);
      }
    },
    onError: params?.onError,
  });
  return createCharacterQuery;
}
