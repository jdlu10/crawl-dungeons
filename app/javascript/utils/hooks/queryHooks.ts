import { useCallback } from "react";
import { useAppStore } from "../../store/AppStore";
import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  const gameId = useAppStore((s) => s.game.id);
  const playerId = useAppStore((s) => s.playerId);

  const invalidateCombatInfo = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["load_combat_info", gameId, playerId],
    });
  }, [gameId, playerId]);

  const invalidatePartyInfo = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["party", gameId, playerId],
    });
  }, [gameId, playerId]);

  const invalidateAvailableCharacters = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["available_characters", gameId, playerId],
    });
  }, [gameId, playerId]);

  const invalidateGames = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["games", playerId] });
  }, [playerId]);

  return {
    invalidateCombatInfo,
    invalidatePartyInfo,
    invalidateAvailableCharacters,
    invalidateGames,
  };
}
