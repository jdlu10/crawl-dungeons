import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FacingDirections,
  Game,
  Party,
  PartyCoordinates,
  TypeMap,
} from "../../types/GameTypes";
import {
  Character,
  Race,
  TypeElement,
  VisualRender,
  Vocation,
} from "../../types/CharacterTypes";

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

export function useResumeAdventure(options?: useGameStartOptions) {
  const resumeAdventureQuery = useMutation({
    mutationFn: async (resumeGame: {
      game_id: number | undefined;
      player_id: number | undefined;
    }) => {
      const response = await fetch(
        "/api/v1/games/" + resumeGame.game_id + "/resume_adventure",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resumeGame),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to start game from backend.");
      }
      return await response.json();
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  return resumeAdventureQuery;
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

export function useQueryLoadCurrentMapInfo(
  gameId: number | undefined,
  player_id: number | undefined
) {
  const loadCurrentMapQuery = useQuery({
    queryKey: ["load_current_map_info", gameId, player_id],
    queryFn: async () => {
      if (!gameId || !player_id) return {} as TypeMap;
      const response = await fetch(
        "/api/v1/games/" + gameId + "/current_map?player_id=" + player_id
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as TypeMap;
    },
    enabled: !!gameId,
  });

  return loadCurrentMapQuery;
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

export function useGetElements() {
  const getElementsQuery = useQuery({
    queryKey: ["get_elements"],
    queryFn: async () => {
      const response = await fetch("/api/v1/get_elements");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as TypeElement[];
    },
  });

  return getElementsQuery;
}

export function useGetPortraits() {
  const getCharacterPortraitsQuery = useQuery({
    queryKey: ["get_character_portraits"],
    queryFn: async () => {
      const response = await fetch("/api/v1/get_character_portraits");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as VisualRender[];
    },
  });

  return getCharacterPortraitsQuery;
}

export function useGetVocations() {
  const getVocationsQuery = useQuery({
    queryKey: ["get_vocations"],
    queryFn: async () => {
      const response = await fetch("/api/v1/get_vocations");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Vocation[];
    },
  });

  return getVocationsQuery;
}

export function useGetRaces() {
  const getRacesQuery = useQuery({
    queryKey: ["get_races"],
    queryFn: async () => {
      const response = await fetch("/api/v1/get_races");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Race[];
    },
  });

  return getRacesQuery;
}

export function useTurnPartyQuery(options?: {
  onSuccess?: (data: Party, direction: FacingDirections) => void;
  onError?: (error: any) => void;
}) {
  const updatePartyQuery = useMutation({
    mutationFn: async (turnPartyParams: {
      player_id: number | undefined;
      game_id: number | undefined;
      direction: FacingDirections;
    }) => {
      const response = await fetch(
        "/api/v1/games/" + turnPartyParams.game_id + "/party/turn",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(turnPartyParams),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to turn player party");
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      if (options?.onSuccess) {
        options?.onSuccess(data, variables.direction);
      }
    },
    onError: options?.onError,
  });

  return updatePartyQuery;
}

export function useMovePartyQuery(options?: {
  onSuccess?: (data: Party, position: PartyCoordinates) => void;
  onError?: (error: any) => void;
}) {
  const updatePartyQuery = useMutation({
    mutationFn: async (movePartyParams: {
      player_id: number | undefined;
      game_id: number | undefined;
      position: PartyCoordinates;
    }) => {
      const response = await fetch(
        "/api/v1/games/" + movePartyParams.game_id + "/party/move",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movePartyParams),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to move player party");
      }
      return await response.json();
    },
    onSuccess: (data, variables) => {
      if (options?.onSuccess) {
        options?.onSuccess(data, variables.position);
      }
    },
    onError: options?.onError,
  });

  return updatePartyQuery;
}
