import React, { useEffect, useState } from "react";
import { useAppStore } from "../../store/AppStore";
import Button from "../Utils/Button";
import Loading from "../Utils/Loading";
import {
  useDeleteGameQuery,
  useQueryGetPlayerGames,
  useQueryLoadGameInfo,
} from "../../utils/hooks/gameHooks";
import { useInvalidateQueries } from "../../utils/hooks/queryHooks";

type GamesProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function Games(props: GamesProps) {
  const { invalidateGames } = useInvalidateQueries();
  const playerId = useAppStore((state) => state.playerId);
  const game = useAppStore((state) => state.game);
  const [gameId, setGameId] = useState<number | undefined>(undefined);

  const { data: games, isLoading, isError } = useQueryGetPlayerGames(playerId);

  const { mutateAsync: deleteGame } = useDeleteGameQuery({
    onSuccess: () => {
      invalidateGames();
      props.setCurrentMenu("main-menu");
    },
    onError: (error) => {
      console.error("Error deleting game:", error);
      alert("Failed to delete game. Please try again.");
    },
  });

  const {
    data: fetchedGame,
    refetch: refetchGameInfo,
    isLoading: isLoadingGameInfo,
    isFetched: isFetchedGameInfo,
    isError: isErrorLoadGame,
  } = useQueryLoadGameInfo(gameId, playerId);

  useEffect(() => {
    if (fetchedGame) {
      const { game_state } = fetchedGame;
      game.setId(fetchedGame.id);
      game.setGameState(game_state);
    }
  }, [fetchedGame]);

  return (
    <>
      <h1 className="mb-10 text-4xl font-semibold tracking-tight">
        Choose a saved game to continue
      </h1>
      <div className="cta-buttons">
        {isLoading && <Loading />}
        {games?.map((game) => (
          <div key={`game-${game.id}`}>
            <Button
              onClick={() => {
                setGameId(game.id);
                refetchGameInfo();
              }}
            >
              SAVE {game.id}:{" "}
              {`${new Date(game.updated_at).toLocaleDateString()} ${new Date(
                game.updated_at
              ).toLocaleTimeString()}`}
            </Button>
            <Button
              onClick={() => {
                let confirmDelete = window.confirm(
                  `Are you sure you want to delete save ${game.id}? This action cannot be undone.`
                );
                if (confirmDelete) {
                  deleteGame({
                    player_id: playerId,
                    game_id: game.id,
                  });
                } else {
                  console.log("Delete action cancelled by user.");
                }
              }}
              classNames="ml-2"
            >
              DELETE SAVE {game.id}
            </Button>
          </div>
        ))}
        <br />
        <Button onClick={() => props.setCurrentMenu("main-menu")}>
          Back to Main Menu
        </Button>
      </div>
    </>
  );
}
