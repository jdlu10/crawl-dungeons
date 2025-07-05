import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import { useQuery } from "@tanstack/react-query";
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
  const {
    data: games,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch("/api/v1/games/by_player/1"); // Replace '1' with the actual player ID
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Game[];
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
          <MainMenuButton
            key={game.id}
            onClick={() => props.setCurrentMenu("game")}
          >
            SAVE {game.id}:{" "}
            {`${new Date(game.updated_at).toLocaleDateString()} ${new Date(
              game.updated_at
            ).toLocaleTimeString()}`}
          </MainMenuButton>
        ))}
        <br />
        <MainMenuButton onClick={() => props.setCurrentMenu("main-menu")}>
          Back to Main Menu
        </MainMenuButton>
      </div>
    </>
  );
}
