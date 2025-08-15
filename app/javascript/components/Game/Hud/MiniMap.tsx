import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import {
  DIRECTIONS,
  FacingDirections,
  MoveDirections,
  TypeMap,
} from "../../../types/GameTypes";
import {
  useMovePartyQuery,
  useQueryLoadCurrentMapInfo,
  useTurnPartyQuery,
} from "../../../utils/hooks/gameHooks";
import TriangleArrows from "../../Utils/TriangleArrows";

type TMiniMapFrameOptions = {
  onClick?: (map: TypeMap) => void;
  additionalElements?: (map: TypeMap) => React.ReactNode;
};

const ZOOM_LEVEL_FAR = 10; // 10 columns
const ZOOM_LEVEL_NORMAL = 5; // 5 columns
const ZOOM_LEVEL_NEAR = 3; // 3 columns

// W = Wall, . = Floor, S = Start, E = Exit, U = Up, D = Down, T = Treasure, B = Boss
const tileStyles: Record<string, string> = {
  W: "bg-gray-300",
  ".": "bg-black",
  " ": "bg-gray-300",
  T: "bg-yellow-500",
  B: "bg-red-500",
  D: "bg-blue-500",
  S: "bg-green-500",
  E: "bg-orange-500",
};
const tileNotes: Record<string, string> = {
  W: "",
  ".": "",
  " ": "",
  T: "Treasure",
  B: "Boss",
  D: "Door",
  S: "Start",
  E: "Exit",
};
const directionOrders: Record<string, FacingDirections[]> = {
  left: ["N", "W", "S", "E"],
  right: ["N", "E", "S", "W"],
};

export function useMiniMap(options?: TMiniMapFrameOptions) {
  const game = useAppStore((s) => s.game);
  const playerId = useAppStore((s) => s.playerId);
  const party = useAppStore((s) => s.party);
  const partyData = useAppStore((s) => s.party.data);
  const [zoomLevel, setZoonLevel] = useState<number>(ZOOM_LEVEL_NORMAL);
  const [minimap, setMinimap] = useState<React.ReactElement>(<></>);

  let gridSize = ZOOM_LEVEL_NORMAL * 2 + 1;

  const { mutateAsync: turnParty, isPending: isPendingTurn } =
    useTurnPartyQuery({
      onSuccess: (data, direction) => {
        party.setPartyFacing(direction);
      },
      onError: (error) => {
        console.error("Error turning player party:", error);
        alert("Failed to turn the party. Please try again.");
      },
    });
  const { mutateAsync: moveParty, isPending: isPendingMove } =
    useMovePartyQuery({
      onSuccess: (data, position) => {
        party.setPartyPosition(position);
        if (data.status === "exploring" || data.status === "combat") {
          party.setPartyStatus(data.status);
        }
      },
      onError: (error) => {
        console.error("Error turning player party:", error);
        alert("Failed to turn the party. Please try again.");
      },
    });

  const {
    data: fetchedMap,
    refetch: refetchMapInfo,
    isLoading: isLoadingMapInfo,
    isFetched: isFetchedMapInfo,
    isError: isErrorLoadMap,
  } = useQueryLoadCurrentMapInfo(game.id, playerId);

  const directionDeltas: Record<FacingDirections, { dx: number; dy: number }> =
    {
      N: { dx: 0, dy: -1 },
      E: { dx: 1, dy: 0 },
      S: { dx: 0, dy: 1 },
      W: { dx: -1, dy: 0 },
    };

  const turn = (direction: "left" | "right") => {
    const partyFacing = partyData?.facing_direction;
    const tileMap = fetchedMap?.detail;
    if (!tileMap || !partyFacing) return;

    const order: FacingDirections[] = directionOrders[direction];
    const idx = order.indexOf(partyData?.facing_direction as FacingDirections);
    const newDirection = order[(idx + 1) % 4];
    turnParty({
      player_id: playerId,
      game_id: game?.id,
      direction: newDirection as FacingDirections,
    });
  };

  const getRelativeDelta = (
    facingDirection: FacingDirections,
    relative: MoveDirections
  ): { dx: number; dy: number } => {
    const index = DIRECTIONS.indexOf(facingDirection);

    let dir: FacingDirections;
    switch (relative) {
      case "forward":
        dir = facingDirection;
        break;
      case "back":
        dir = DIRECTIONS[(index + 2) % 4];
        break;
      case "left":
        dir = DIRECTIONS[(index + 3) % 4];
        break;
      case "right":
        dir = DIRECTIONS[(index + 1) % 4];
        break;
    }

    return directionDeltas[dir];
  };

  const move = (direction: MoveDirections) => {
    const partyFacing = partyData?.facing_direction as FacingDirections;
    const playerPosX = partyData?.position ? partyData.position[0] : undefined;
    const playerPosY = partyData?.position ? partyData.position[1] : undefined;
    const tileMap = fetchedMap?.detail;
    if (!partyFacing || !playerPosY || !playerPosX || !tileMap) return;
    const delta = getRelativeDelta(partyFacing, direction);
    const newX = playerPosX + delta.dx;
    const newY = playerPosY + delta.dy;

    if (
      newY >= 0 &&
      newY < tileMap.length &&
      newX >= 0 &&
      newX < tileMap[0].length &&
      tileMap[newY][newX] !== "W"
    ) {
      moveParty({
        player_id: playerId,
        game_id: game?.id,
        position: [newX, newY],
      });
    }
  };

  const renderTile = (x: number, y: number) => {
    const playerPosX = partyData?.position ? partyData.position[0] : undefined;
    const playerPosY = partyData?.position ? partyData.position[1] : undefined;
    const tileMap = fetchedMap?.detail;

    if (!playerPosX || !playerPosY || !tileMap) {
      return <div key={`${x}-${y}`}></div>;
    }

    const mapX = playerPosX + (x - zoomLevel);
    const mapY = playerPosY + (y - zoomLevel);

    let tile = " ";
    let isPlayer = false;

    if (
      mapY >= 0 &&
      mapY < tileMap.length &&
      mapX >= 0 &&
      mapX < tileMap[0].length
    ) {
      tile = tileMap[mapY][mapX];
      isPlayer = mapX === playerPosX && mapY === playerPosY;
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`border text-center text-xs flex items-center justify-center ${
          tileStyles[tile] || "bg-transparent"
        } ${isPlayer ? "ring-2" : ""}`}
        title={tileNotes[tile]}
      >
        {isPlayer && (
          <TriangleArrows
            direction={partyData?.facing_direction as FacingDirections}
          />
        )}
      </div>
    );
  };

  const renderMap = () => {
    if (fetchedMap) {
      return (
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: gridSize }, (_, y) =>
            Array.from({ length: gridSize }, (_, x) => renderTile(x, y))
          )}
        </div>
      );
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    if (fetchedMap) {
      party.setCurrentMap(fetchedMap);
      setMinimap(renderMap());
    }
  }, [fetchedMap]);

  useEffect(() => {
    if (partyData?.position) {
      setMinimap(renderMap());
    }
  }, [partyData?.position, partyData?.facing_direction]);

  const MiniMap = () => (
    <section className="mini-map w-full h-full overflow-hidden opacity-65">
      {minimap}
    </section>
  );
  return {
    move,
    turn,
    MiniMap,
    isPendingTurn,
    isPendingMove,
  };
}
