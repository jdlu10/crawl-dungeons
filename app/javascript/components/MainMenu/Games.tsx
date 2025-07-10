import React, { useEffect, useState } from "react";
import { useAppStore } from "../../store/AppStore";
import { useQueryClient } from "@tanstack/react-query";
import MainMenuButton from "./MainMenuButton";
import Loading from "../Utils/Loading";
import {
  useDeleteGameQuery,
  useQueryGetPlayerGames,
  useQueryLoadGameInfo,
} from "../../utils/hooks/gameHooks";

type GamesProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function Games(props: GamesProps) {
  const { playerId, game } = useAppStore();
  const queryClient = useQueryClient();
  const [gameId, setGameId] = useState<number | undefined>(undefined);

  const { data: games, isLoading, isError } = useQueryGetPlayerGames(playerId);

  const { mutateAsync: deleteGame } = useDeleteGameQuery({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      props.setCurrentMenu("main-menu");
    },
    onError: (error) => {
      console.error("Error deleting game:", error);
      alert("Failed to delete game. Please try again.");
    },
  });

  const {
    data: fetechedGame,
    refetch: refetchGameInfo,
    isLoading: isLoadingGameInfo,
    isFetched: isFetchedGameInfo,
    isError: isErrorLoadGame,
  } = useQueryLoadGameInfo(gameId);

  useEffect(() => {
    if (fetechedGame) {
      const { game_state } = fetechedGame;
      if (game_state === "character-creation") {
        game.setGameState("character-creation");
      } else {
        game.setGameState(game_state);
      }
    }
  }, [fetechedGame]);

  return (
    <>
      <h1 className="mb-10 text-4xl font-semibold tracking-tight">
        Choose a saved game to continue
      </h1>
      <div className="cta-buttons">
        {isLoading && <Loading />}
        {games?.map((game) => (
          <div key={`game-${game.id}`}>
            <MainMenuButton
              onClick={() => {
                setGameId(game.id);
                refetchGameInfo();
              }}
            >
              SAVE {game.id}:{" "}
              {`${new Date(game.updated_at).toLocaleDateString()} ${new Date(
                game.updated_at
              ).toLocaleTimeString()}`}
            </MainMenuButton>
            <MainMenuButton
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
            </MainMenuButton>
          </div>
        ))}
        <br />
        <MainMenuButton onClick={() => props.setCurrentMenu("main-menu")}>
          Back to Main Menu
        </MainMenuButton>
      </div>
    </>
  );
}
