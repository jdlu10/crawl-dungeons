import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import { FacingDirections } from "../../../types/GameTypes";

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
const tileGraphic: Record<string, string> = {
  W: "dungeon-stone-wall",
  ".": "dungeon-stone-wall",
  " ": "",
  T: "dungeon-treasure",
  B: "dungeon-boss",
  D: "dungeon-door",
  S: "dungeon-start",
  E: "dungeon-end",
};
const viewportBlockStyles = ["farthest", "farther", "far", "near", "nearest"];

export default function GameViewport() {
  const partyData = useAppStore((state) => state.party.data);
  const currentMap = useAppStore((state) => state.party.currentMap);
  const VIEW_DISTANCE = 4;
  const VIEW_RANGE = VIEW_DISTANCE * 2 + 1;

  const getTransformedCoordinates = (
    px: number,
    py: number,
    dx: number,
    dy: number,
    direction: FacingDirections
  ): [number, number] => {
    switch (direction) {
      case "N":
        return [px + dx, py + dy];
      case "S":
        return [px - dx, py - dy];
      case "W":
        return [px + dy, py - dx];
      case "E":
        return [px - dy, py + dx];
      default:
        return [px + dx, py + dy];
    }
  };

  const renderBlock = (x: number, y: number) => {
    const playerPosX = partyData?.position?.[0];
    const playerPosY = partyData?.position?.[1];
    const tileMap = currentMap?.detail;
    const playerDirection = partyData?.facing_direction as FacingDirections;

    if (
      typeof playerPosX !== "number" ||
      typeof playerPosY !== "number" ||
      !tileMap ||
      !playerDirection
    ) {
      return <div key={`${x}-${y}`}></div>;
    }

    const dx = x - VIEW_DISTANCE;
    const dy = y - VIEW_DISTANCE;
    const [mapX, mapY] = getTransformedCoordinates(
      playerPosX,
      playerPosY,
      dx,
      dy,
      playerDirection
    );

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
        className={`flex items-center justify-center ${
          tileGraphic[tile]
        } viewport-tile tile-label-${tile} ${
          viewportBlockStyles[y]
        } tile-y-${y} tile-x-${x} ${isPlayer ? "player-tile" : ""}`}
      >
        <div className="face top"></div>
        <div className="face bottom"></div>
        <div className="face left"></div>
        <div className="face right"></div>
        <div className="face front"></div>
        <div className="face back"></div>
      </div>
    );
  };

  const renderViewport = () => {
    console.log(currentMap);
    return (
      <>
        <div
          className="viewport-grid grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${VIEW_RANGE}, 1fr)`,
            gridTemplateRows: `repeat(${VIEW_DISTANCE + 1}, 1fr)`,
          }}
        >
          {Array.from({ length: VIEW_DISTANCE + 1 }, (_, y) =>
            Array.from({ length: VIEW_RANGE }, (_, x) => renderBlock(x, y))
          )}
        </div>
      </>
    );
  };

  const shouldRender =
    partyData?.position && partyData?.facing_direction && currentMap;

  return (
    <div className="viewport w-full h-full min-w-6xl">
      {shouldRender && (
        <div
          className="viewport-grid grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${VIEW_RANGE}, 1fr)`,
            gridTemplateRows: `repeat(${VIEW_DISTANCE + 1}, 1fr)`,
          }}
        >
          {Array.from({ length: VIEW_DISTANCE + 1 }, (_, y) =>
            Array.from({ length: VIEW_RANGE }, (_, x) => renderBlock(x, y))
          )}
        </div>
      )}
    </div>
  );
}
