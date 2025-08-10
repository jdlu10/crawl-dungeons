import React, { useEffect, useState } from "react";
import { useMiniMap } from "./MiniMap";
import { CaretUp } from "../../Utils/Carets";

export default function MovementControls() {
  const { move, turn, isMoving } = useMiniMap();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMoving) {
        switch (event.key.toLowerCase()) {
          case "w":
            move("forward");
            break;
          case "s":
            move("back");
            break;
          case "q":
            move("left");
            break;
          case "e":
            move("right");
            break;
          case "a":
            turn("left");
            break;
          case "d":
            turn("right");
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoving, move, turn]);

  return (
    <section className="movement-controls grid grid-cols-4 grid-rows-2 w-full h-full overflow-hidden opacity-50 gap-2.5 px-2.5">
      <button
        className="border cursor-pointer w-full h-full move-left"
        disabled={isMoving}
        onClick={() => {
          move("left");
        }}
        title="Q"
      >
        <CaretUp />
      </button>
      <button
        className="border cursor-pointer w-full h-full col-span-2 move-forward"
        disabled={isMoving}
        onClick={() => {
          move("forward");
        }}
        title="W"
      >
        <CaretUp />
      </button>
      <button
        className="border cursor-pointer w-full h-full move-right"
        disabled={isMoving}
        onClick={() => {
          move("right");
        }}
        title="E"
      >
        <CaretUp />
      </button>
      <button
        className="border cursor-pointer w-full h-full turn-left"
        disabled={isMoving}
        onClick={() => {
          turn("left");
        }}
        title="A"
      >
        Turn left
      </button>
      <button
        className="border cursor-pointer w-full h-full col-span-2 move-back"
        disabled={isMoving}
        onClick={() => {
          move("back");
        }}
        title="S"
      >
        <CaretUp />
      </button>
      <button
        className="border cursor-pointer w-full h-full turn-right"
        disabled={isMoving}
        onClick={() => {
          turn("right");
        }}
        title="D"
      >
        Turn Right
      </button>
    </section>
  );
}
