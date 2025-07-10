import { useQuery } from "@tanstack/react-query";
import { Campaign } from "../../types/CampaignTypes";

export function useQueryCampaigns() {
  const campaignsQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/v1/campaigns");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as Campaign[];
    },
  });

  return campaignsQuery;
}
