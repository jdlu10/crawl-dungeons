import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import Button from "../Utils/Button";
import Loading from "../Utils/Loading";
import { useQueryCampaigns } from "../../utils/hooks/campaignHooks";
import { useGameStart } from "../../utils/hooks/gameHooks";
import { useInvalidateQueries } from "../../utils/hooks/queryHooks";

type CampaignsProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function Campaigns(props: CampaignsProps) {
  const { invalidateGames } = useInvalidateQueries();
  const playerId = useAppStore((state) => state.playerId);
  const game = useAppStore((state) => state.game);

  const { data: campaigns, isLoading, isError } = useQueryCampaigns();

  const { mutateAsync: startGame } = useGameStart({
    onSuccess: (data) => {
      invalidateGames();
      game.setId(data.id);
      game.setGameState("party-preparation");
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
            <Button
              onClick={() => {
                startGame({
                  campaign_id: campaign.id,
                  player_id: playerId,
                });
              }}
            >
              {campaign.name}
            </Button>
            <br />
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
