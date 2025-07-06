import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MainMenuButton from "./MainMenuButton";
import Loading from "../Utils/Loading";

type Campaign = {
  id: number;
  name: string;
  key: string;
  created_at: string;
  updated_at: string;
  starting_map: number;
  description: string;
  active: boolean;
};

type CampaignsProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function Campaigns(props: CampaignsProps) {
  const playerId = useAppStore((state) => state.playerId);
  const queryClient = useQueryClient();
  const {
    data: campaigns,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/v1/campaigns");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Campaign[];
    },
  });

  const { mutateAsync: startGame } = useMutation({
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
        throw new Error("Failed to start game");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      props.setCurrentMenu("characters");
    },
    onError: (error) => {
      console.error("Error starting game:", error);
      alert(
        "Failed to start game. Please try again. If you already have 3 save games please delete one before starting a new game."
      );
    },
  });

  return (
    <>
      <h1 className="mb-10 text-4xl font-semibold tracking-tight">
        Choose a campaign to start
      </h1>
      <div className="cta-buttons">
        {isLoading && <Loading />}
        {campaigns?.map((campaign) => (
          <div key={campaign.key}>
            <MainMenuButton
              onClick={() => {
                startGame({
                  campaign_id: campaign.id,
                  player_id: playerId,
                });
              }}
            >
              {campaign.name}
            </MainMenuButton>
            <br />
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
