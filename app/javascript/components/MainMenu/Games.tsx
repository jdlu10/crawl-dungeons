import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainMenuButton from "./MainMenuButton";
import Loading from "../Utils/Loading";

type Game = {
  id: number;
  campaign_id: number;
  player_id: number;
  active: boolean;
  updated_at: string;
};

type GamesProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function Games(props: GamesProps) {
  const queryClient = useQueryClient();
  const playerId = useAppStore((state) => state.playerId);

  const {
    data: games,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch("/api/v1/games/by_player/" + playerId);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Game[];
    },
  });

  const { mutateAsync: deleteGame } = useMutation({
    mutationFn: async (gameToDelete: {
      campaign_id: number;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      props.setCurrentMenu("main-menu");
    },
    onError: (error) => {
      console.error("Error deleting game:", error);
      alert("Failed to delete game. Please try again.");
    },
  });

  return (
    <>
      <h1 className="mb-10 text-4xl font-semibold tracking-tight">
        Choose a saved game to continue
      </h1>
      <div className="cta-buttons">
        {isLoading && <Loading />}
        {games?.map((game) => (
          <div key={`game-${game.id}`}>
            <MainMenuButton onClick={() => props.setCurrentMenu("game")}>
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
                    campaign_id: game.campaign_id,
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
