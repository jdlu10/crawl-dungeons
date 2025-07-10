import { useQuery } from "@tanstack/react-query";
import { Character } from "../../types/CharacterTypes";

// export function useQueryCampaigns() {
//   const campaignsQuery = useQuery({
//     queryKey: ["available-characters-for-hire"],
//     queryFn: async () => {
//       const response = await fetch("/api/v1/campaigns");
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return (await response.json()) as Campaign[];
//     },
//   });

//   return campaignsQuery;
// }
