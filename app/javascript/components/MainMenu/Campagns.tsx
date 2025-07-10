import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MainMenuButton from "./MainMenuButton";
import Loading from "../Utils/Loading";
import { useQueryCampaigns } from "../../utils/hooks/campaignHooks";
import { useGameStart } from "../../utils/hooks/gameHooks";

type CampaignsProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function Campaigns(props: CampaignsProps) {
  const queryClient = useQueryClient();
  const { playerId, game } = useAppStore();

  const { data: campaigns, isLoading, isError } = useQueryCampaigns();

  const { mutateAsync: startGame } = useGameStart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      game.setGameState("character-creation");
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
