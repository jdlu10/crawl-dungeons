import { useMutation, useQuery } from "@tanstack/react-query";
import { Game, Party } from "../../types/GameTypes";
import { Character } from "../../types/CharacterTypes";

export function useQueryGetPlayerGames(playerId: number | undefined) {
  const playerGamesQuery = useQuery({
    queryKey: ["games", playerId],
    queryFn: async () => {
      if (!playerId) return [] as Game[];
      const response = await fetch("/api/v1/games/by_player/" + playerId);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Game[];
    },
  });

  return playerGamesQuery;
}

type useGameStartOptions = {
  onSuccess?: (data: Game) => void;
  onError?: (error: any) => void;
};

export function useGameStart(options?: useGameStartOptions) {
  const gameStartQuery = useMutation({
    mutationFn: async (newGame: {
      campaign_id: number;
      player_id: number | undefined;
    }) => {
      const response = await fetch("/api/v1/games/new_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });
      if (!response.ok) {
        throw new Error("Failed to start game from backend.");
      }
      return await response.json();
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  return gameStartQuery;
}

type useDeleteGameQueryOptions = {
  onSuccess?: (data: Game) => void;
  onError?: (error: any) => void;
};

export function useDeleteGameQuery(options?: useDeleteGameQueryOptions) {
  const deleteGameQuery = useMutation({
    mutationFn: async (gameToDelete: {
      player_id: number | undefined;
      game_id: number;
    }) => {
      const response = await fetch(
        "/api/v1/games/delete_game/" + gameToDelete.game_id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameToDelete),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete game");
      }
      return await response.json();
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  return deleteGameQuery;
}

export function useQueryLoadGameInfo(
  gameId: number | undefined,
  player_id: number | undefined
) {
  const loadGameInfoQuery = useQuery({
    queryKey: ["load_game_info", gameId, player_id],
    queryFn: async () => {
      if (!gameId || !player_id) return {} as Game;
      const response = await fetch(
        "/api/v1/games/" + gameId + "?player_id=" + player_id
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Game;
    },
    enabled: !!gameId,
  });

  return loadGameInfoQuery;
}

export function useQueryGetAvailableCharacters(
  gameId: number | undefined,
  player_id: number | undefined
) {
  const loadGameInfoQuery = useQuery({
    queryKey: ["get_available_characters", gameId, player_id],
    queryFn: async () => {
      if (!gameId || !player_id) return {} as Game;
      const response = await fetch(
        "/api/v1/games/" +
          gameId +
          "/available_characters?player_id=" +
          player_id
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Character[];
    },
    enabled: !!gameId,
  });

  return loadGameInfoQuery;
}

export function useQueryGetPlayerPartyInfo(
  gameId: number | undefined,
  player_id: number | undefined
) {
  const loadGameInfoQuery = useQuery({
    queryKey: ["get_player_party_info", gameId, player_id],
    queryFn: async () => {
      if (!gameId || !player_id) return {} as Game;
      const response = await fetch(
        "/api/v1/games/" + gameId + "/party?player_id=" + player_id
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Party;
    },
    enabled: !!gameId,
  });

  return loadGameInfoQuery;
}
