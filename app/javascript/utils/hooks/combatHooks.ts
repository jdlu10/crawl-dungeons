import { useMutation, useQuery } from "@tanstack/react-query";
import { BattleInfo, GameEvent, Party } from "../../types/GameTypes";

type loadCombatInfoParams = {
  gameId: number | undefined;
  playerId: number | undefined;
  combat: string | undefined;
};
export function useQueryLoadCombatInfo(params: loadCombatInfoParams) {
  const { gameId, playerId, combat } = params;

  const loadCombatInfoQuery = useQuery({
    queryKey: ["load_combat_info", gameId, playerId],
    queryFn: async () => {
      if (!gameId || !playerId) return {} as BattleInfo;
      const response = await fetch(
        "/api/v1/games/" + gameId + "/combat?player_id=" + playerId
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as BattleInfo;
    },
    enabled: combat === "combat" || combat === "victory" || combat === "defeat",
  });

  return loadCombatInfoQuery;
}

type useCharacterInteractionQueriesParams = {
  onSuccess?: (
    data: GameEvent[],
    ability_id: number,
    targetCharacterId: number | undefined
  ) => void;
  onError?: (error: any) => void;
};

export function useQueryAbilityActions(
  params: useCharacterInteractionQueriesParams
) {
  const createCharacterQuery = useMutation({
    mutationFn: async (abilityActionParams: {
      game_id: number | undefined;
      player_id: number | undefined;
      character_id: number | undefined;
      ability_id: number;
    }) => {
      const response = await fetch(
        "/api/v1/games/" +
          abilityActionParams.game_id +
          "/combat/ability/" +
          abilityActionParams.ability_id +
          "/use",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(abilityActionParams),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to use ability: ${abilityActionParams.ability_id} ${
            abilityActionParams.character_id
              ? "on character " + abilityActionParams.character_id
              : ""
          }`
        );
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      if (params?.onSuccess) {
        params?.onSuccess(data, variables.ability_id, variables.character_id);
      }
    },
    onError: params?.onError,
  });
  return createCharacterQuery;
}
